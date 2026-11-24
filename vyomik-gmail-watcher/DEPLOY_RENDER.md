# Deploying Vyomik Gmail Watcher to Render.com

This service monitors incoming HDFC Bank UPI payment notification emails in real time and automatically confirms payments on the VYOMIK store without manual screenshot uploads.

---

## 1. Prerequisites

1. **Gmail App Password**:
   - Go to Google Account &rarr; Security &rarr; 2-Step Verification &rarr; **App passwords**.
   - Create a new App Password named `VyomikWatcher`.
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`).

2. **Redis URL**:
   - Create a free serverless Redis database on [Upstash](https://upstash.com) or use your managed Redis.

---

## 2. Deploy on Render.com

1. Create a GitHub repository for `vyomik-gmail-watcher`:
   ```bash
   cd d:/Vyomik-/vyomik-gmail-watcher
   git init
   git add .
   git commit -m "Initial commit for Vyomik Gmail Watcher"
   gh repo create vyomik-gmail-watcher --private --source=. --push
   ```

2. Open the [Render Dashboard](https://dashboard.render.com).
3. Click **New +** &rarr; **Web Service**.
4. Connect the `vyomik-gmail-watcher` repository.
5. Render will automatically detect `render.yaml`. Confirm:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
   - **Plan**: Free (or Starter for 24/7 uptime without sleep)

6. Set the **Environment Variables**:
   | Variable | Value | Description |
   |---|---|---|
   | `GMAIL_USER` | `your_hdfc_alerts@gmail.com` | Email where HDFC Bank alerts arrive |
   | `GMAIL_APP_PASSWORD` | `16_char_app_password` | Google App Password (not account password) |
   | `SITE_CALLBACK_BASE` | `https://api.vyomik.com` | Live backend URL of VYOMIK |
   | `WATCH_API_KEY` | `vyomik_sec_watch_2026_prod_token` | Secret key matching backend `WATCH_API_KEY` |
   | `REDIS_URL` | `rediss://...` | Upstash Redis connection string |
   | `POLL_INTERVAL` | `5000` | Backup check interval in milliseconds |

7. Click **Create Web Service**.

---

## 3. Real-Time Operation

- The service establishes a persistent IMAP SSL connection to `imap.gmail.com:993`.
- When an email arrives from HDFC Bank, Gmail triggers an immediate `exists` event.
- The watcher extracts:
  - Bank UTR / UPI Reference No.
  - Transaction Amount (INR).
  - Payer VPA / UPI ID (including masked handles like `*******atel@fam`).
  - Transaction Reference (`tr`) if in remark.
- It posts to `/api/v1/payments/verify-callback/:tr` with the `x-api-key` header.
- VYOMIK instantly confirms the order, issues an official PDF receipt, and notifies the customer!
