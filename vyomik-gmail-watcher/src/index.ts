import 'dotenv/config';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import Redis from 'ioredis';
import axios from 'axios';
import { server } from './health.js';

// Redis connection (Upstash or local)
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const useTLS = redisUrl.startsWith('rediss://');
const redis = new Redis(redisUrl, {
  ...(useTLS && { tls: { rejectUnauthorized: false } }),
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 100, 3000),
  lazyConnect: true,
});
redis.on('error', (err) => console.error('[Redis] Error:', err.message));

// Target VYOMIK API Base URL
const rawBase = process.env.SITE_CALLBACK_BASE || 'http://127.0.0.1:8000';
const SITE_CALLBACK_BASE = rawBase.replace(/\/api\/?$/, '').replace(/\/$/, '');

const WATCH_API_KEY = process.env.WATCH_API_KEY || 'vyomik_sec_watch_2026_prod_token';
const GMAIL_USER = process.env.GMAIL_USER || '';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASS || '';
const POLL_INTERVAL = Math.min(parseInt(process.env.POLL_INTERVAL || '5000', 10), 15000);

interface ParsedPayment {
  utr: string;
  amount: number;
  senderName: string;
  senderUpi: string;
  ourTr?: string;
  timestamp: Date;
  rawSnippet?: string;
}

interface PendingOrder {
  tr: string;
  orderId: string;
  amount: number;
  payerUpiId?: string;
  createdAt: number;
}

let isRunning = false;
let imapClient: ImapFlow | null = null;
let isConnected = false;
let isConnecting = false;
const processedUtrs = new Set<string>();

function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeUpi(upi: string): string {
  return (upi || '').trim().toLowerCase();
}

function matchesUpi(enteredUpi: string, emailUpi: string): boolean {
  const normEntered = normalizeUpi(enteredUpi || '');
  const normEmail = normalizeUpi(emailUpi || '');

  if (!normEntered || !normEmail) return false;
  if (normEntered === normEmail) return true;

  const [enteredUser, enteredDomain] = normEntered.split('@');
  const [emailUser, emailDomain] = normEmail.split('@');

  if (!enteredDomain || !emailDomain || enteredDomain !== emailDomain) return false;

  // Masked VPA handling: e.g. *******atel@fam or xxxxxxxatel@fam
  if (emailUser.includes('*') || emailUser.includes('x') || emailUser.includes('X')) {
    const unmaskedSuffixMatch = emailUser.match(/[\*xX]+([a-zA-Z0-9._\-]+)$/);
    const unmaskedPrefixMatch = emailUser.match(/^([a-zA-Z0-9._\-]+)[\*xX]+/);

    const requiredSuffix = unmaskedSuffixMatch ? unmaskedSuffixMatch[1] : '';
    const requiredPrefix = unmaskedPrefixMatch ? unmaskedPrefixMatch[1] : '';

    const suffixOk = !requiredSuffix || enteredUser.endsWith(requiredSuffix);
    const prefixOk = !requiredPrefix || enteredUser.startsWith(requiredPrefix);

    return suffixOk && prefixOk;
  }

  return false;
}

export async function extractPaymentFromEmail(text: string, html: string): Promise<ParsedPayment | null> {
  const fullText = (text || htmlToText(html) || '').trim();

  // 1. Skip outgoing debit notifications (e.g. FamApp 'You have successfully paid')
  const isDebit = /(?:you have (?:successfully\s+)?paid|debited\s+from|has been debited|money\s+sent)/i.test(fullText);
  const isCredit = /(?:has been (?:successfully\s+)?credited|credited to your|received\s*[₹\u20B9RsINR]|received from|sent you\s*[₹\u20B9RsINR]|credited with)/i.test(fullText);
  const trCheck = fullText.match(/tr=([A-Za-z0-9]{6,30})/i);

  if (isDebit && !isCredit && !trCheck) {
    console.log('[Vyomik Watcher] Skipping outgoing debit notification');
    return null;
  }

  // 2. Extract UTR / UPI Reference Number
  const utrMatch = fullText.match(/(?:UPI\s*Reference\s*(?:No\.?|Number)?|UTR(?:\s*No\.?)?|Reference\s*(?:No\.?|Number)?|Transaction\s*(?:ID|Id|No\.?))\s*[:.\-]?\s*([A-Za-z0-9]{10,})/i);
  const utr = utrMatch?.[1] || '';

  // 3. Extract Amount
  let amount = 0;
  const creditedMatch = fullText.match(/(?:Rs\.?|₹|INR)\s*([0-9]+(?:\.[0-9]{1,2})?)\s*has been\s+(?:successfully\s+)?credited/i);
  const debitedMatch = fullText.match(/(?:Rs\.?|₹|INR)\s*([0-9]+(?:\.[0-9]{1,2})?)\s*(?:has been\s+)?debited/i);

  if (creditedMatch) {
    amount = parseFloat(creditedMatch[1]);
  } else if (debitedMatch) {
    amount = parseFloat(debitedMatch[1]);
  } else {
    const amountMatch = fullText.match(/(?:Rs\.?|₹|INR)\s*([0-9]+(?:\.[0-9]{1,2})?)/i);
    amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
  }

  // 4. Extract Sender Name
  let senderName = '';
  const nameMatch = fullText.match(/Sender\s*[:]\s*([^(\n]+?)(?:\s*\(|$)/i);
  if (nameMatch) {
    senderName = nameMatch[1].trim();
  }

  // 5. Extract Sender VPA
  let senderUpi = '';
  const upiMatch = fullText.match(/(?:VPA|UPI\s*(?:ID)?)\s*[:]\s*([A-Za-z0-9._*#xX\-]+@[A-Za-z0-9.\-]+)/i);
  if (upiMatch) {
    senderUpi = normalizeUpi(upiMatch[1]);
  }

  // 6. Check for TR embedded in UPI remark
  const ourTr = trCheck?.[1] || '';

  if (!utr || amount <= 0) {
    return null;
  }

  return {
    utr,
    amount,
    senderName,
    senderUpi,
    ourTr,
    timestamp: new Date(),
    rawSnippet: fullText.substring(0, 300),
  };
}

async function findMatchingOrder(amount: number, senderUpi: string): Promise<PendingOrder | 'ambiguous' | null> {
  try {
    const keys = await redis.keys('pending:order:*');
    const candidates: PendingOrder[] = [];
    const upiCandidates: PendingOrder[] = [];

    for (const key of keys) {
      const order = await redis.hgetall(key);
      if (!order || !order.amount || order.status === 'paid') continue;

      const orderAmount = parseFloat(order.amount);
      if (Math.abs(orderAmount - amount) >= 0.5) continue;

      const createdAt = new Date(order.createdAt || 0).getTime();
      const ageMinutes = (Date.now() - createdAt) / (1000 * 60);
      if (ageMinutes >= 60) continue; // 60-minute matching window

      const candidateObj: PendingOrder = {
        tr: key.replace('pending:order:', ''),
        orderId: order.orderId || order.order_number,
        amount: orderAmount,
        payerUpiId: order.payerUpiId || order.customer_upi_id,
        createdAt,
      };

      candidates.push(candidateObj);

      if (senderUpi && candidateObj.payerUpiId && matchesUpi(candidateObj.payerUpiId, senderUpi)) {
        upiCandidates.push(candidateObj);
      }
    }

    // 1. Matched by UPI (exact or masked)
    if (upiCandidates.length === 1) {
      return upiCandidates[0];
    }
    if (upiCandidates.length > 1) {
      return 'ambiguous';
    }

    // 2. Fallback to unique pending order amount if no UPI
    if (candidates.length === 1) {
      return candidates[0];
    }

    if (candidates.length > 1) {
      return 'ambiguous';
    }

    return null;
  } catch (err) {
    console.error('[Vyomik Watcher] Matching search error:', err);
    return null;
  }
}

async function processPayment(payment: ParsedPayment): Promise<boolean> {
  try {
    if (processedUtrs.has(payment.utr)) {
      return true;
    }

    let targetTr = payment.ourTr;
    let callbackUrl = `${SITE_CALLBACK_BASE}/api/v1/payments/auto-verify`;
    if (targetTr) {
      callbackUrl = `${SITE_CALLBACK_BASE}/api/v1/payments/verify-callback/${targetTr}`;
    }

    console.log(`[Vyomik Watcher] Sending payment verification to ${callbackUrl}...`);

    const response = await axios.post(
      callbackUrl,
      {
        orderId: targetTr || undefined,
        status: 'paid',
        paidAt: payment.timestamp.toISOString(),
        utr: payment.utr,
        amount: payment.amount,
        senderUpi: payment.senderUpi,
        senderName: payment.senderName,
        rawSnippet: payment.rawSnippet,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': WATCH_API_KEY,
        },
        timeout: 20000,
      }
    );

    console.log('[Vyomik Watcher] Callback result:', response.data);
    if (response.data?.ok === true) {
      processedUtrs.add(payment.utr);
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('[Vyomik Watcher] Callback error:', error.response?.data || error.message);
    return false;
  }
}

async function getOrCreateClient(): Promise<ImapFlow | null> {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.warn('[Vyomik Watcher] GMAIL_USER or GMAIL_APP_PASSWORD not configured. Waiting for configuration.');
    return null;
  }

  if (imapClient && isConnected) return imapClient;
  if (isConnecting) return null;

  isConnecting = true;
  try {
    console.log('[Vyomik Watcher] Connecting to Gmail IMAP...');
    const client = new ImapFlow({
      host: 'imap.gmail.com',
      port: 993,
      secure: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
      logger: false,
      disableAutoIdle: false,
    });

    client.on('close', () => {
      console.log('[Vyomik Watcher] IMAP disconnected. Reconnecting...');
      isConnected = false;
      imapClient = null;
    });

    client.on('error', (err: any) => {
      console.error('[Vyomik Watcher] IMAP error:', err?.message || err);
    });

    client.on('exists', (data) => {
      console.log(`[Vyomik Watcher] ⚡ INSTANT PUSH: New email arrived (${data.count} messages). Scanning...`);
      scanInbox().catch(console.error);
    });

    await client.connect();
    isConnected = true;
    imapClient = client;

    await client.mailboxOpen('INBOX');
    console.log('[Vyomik Watcher] ✅ Connected to Gmail and listening in IDLE push mode!');
    return client;
  } catch (err: any) {
    console.error('[Vyomik Watcher] Connection failed:', err?.message || err);
    return null;
  } finally {
    isConnecting = false;
  }
}

export async function scanInbox(): Promise<void> {
  if (isRunning) {
    console.log('[Vyomik Watcher] Scan already in progress, skipping...');
    return;
  }
  isRunning = true;
  console.log('[Vyomik Watcher] scanInbox triggered.');

  try {
    const client = await getOrCreateClient();
    if (!client) {
      console.log('[Vyomik Watcher] No IMAP client available.');
      return;
    }

    console.log('[Vyomik Watcher] Searching inbox for emails from past 4 hours...');
    const since = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const messages = await client.search({ since }, { uid: true });
    const allUids = Array.isArray(messages) ? messages : [];
    console.log(`[Vyomik Watcher] Found ${allUids.length} emails since ${since.toISOString()}`);

    // Take up to the last 25 emails
    const uids = allUids.slice(-25);

    for (const uid of uids) {
      try {
        const msg = await client.fetchOne(uid, { source: true }, { uid: true });
        if (!msg || typeof msg !== 'object' || !('source' in msg)) continue;

        const parsed = await simpleParser((msg as any).source);
        const payment = await extractPaymentFromEmail(parsed.text || '', parsed.html || '');

        if (payment) {
          console.log('[Vyomik Watcher] Extracted valid credit notification:', {
            utr: payment.utr,
            amount: payment.amount,
            senderUpi: payment.senderUpi,
          });
          await processPayment(payment);
        }
      } catch (fetchErr: any) {
        console.warn(`[Vyomik Watcher] Could not process UID ${uid}:`, fetchErr?.message || fetchErr);
      }
    }
    console.log('[Vyomik Watcher] Scan cycle completed.');
  } catch (err: any) {
    console.error('[Vyomik Watcher] Scan error:', err?.message || err);
    if (imapClient) {
      try { await imapClient.logout(); } catch {}
      imapClient = null;
      isConnected = false;
    }
  } finally {
    isRunning = false;
  }
}

export function startWatcher() {
  console.log('[Vyomik Watcher] Starting service...');
  console.log('[Vyomik Watcher] Callback API:', SITE_CALLBACK_BASE);

  scanInbox().catch(console.error);
  return setInterval(() => {
    scanInbox().catch(console.error);
  }, POLL_INTERVAL);
}

const isDirectEntry = process.argv[1] && (
  process.argv[1].endsWith('index.ts') || 
  process.argv[1].endsWith('index.js')
);

if (isDirectEntry && process.env.NODE_ENV !== 'test') {
  startWatcher();
}
