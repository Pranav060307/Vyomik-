process.env.NODE_ENV = 'test';
import { extractPaymentFromEmail } from './src/index';

const hdfcBankCreditEmail = `
Dear Customer, Greetings from HDFC Bank! We're writing to inform you that Rs.2499.00 has been successfully credited to your HDFC Bank account ending in 8960. Transaction Details: a. Date: 23-11-26 b. Sender: Vibhav Patel (VPA: *******atel@fam) c. UPI Reference No.: 630155807241 Need Help? India (Toll-Free): 1800 258 6161 International: 91 22 6160 6160 Or, you can visit your nearest HDFC Bank branch. Thank you for banking with HDFC Bank. Warm Regards, HDFC Bank
`;

const famAppDebitEmail = `
Hey Vibhav Mayuresh Patel, You have successfully paid ₹2499.00 to VYOMIK at 09:30 PM IST, 23 November 2026 with transaction ID FMPU01a181e4. If this was not done by you, report this transaction at support@famapp.in.
`;

(async () => {
  console.log('--- 1. Testing HDFC Credit Email ---');
  const creditResult = await extractPaymentFromEmail(hdfcBankCreditEmail, '');
  console.log('Parsed HDFC Credit:', creditResult);

  if (!creditResult) {
    console.error('FAILED to parse HDFC credit email');
    process.exit(1);
  }
  if (creditResult.utr !== '630155807241') {
    console.error('Incorrect UTR extracted:', creditResult.utr);
    process.exit(1);
  }
  if (creditResult.amount !== 2499) {
    console.error('Incorrect amount extracted:', creditResult.amount);
    process.exit(1);
  }
  if (creditResult.senderUpi !== '*******atel@fam') {
    console.error('Incorrect sender VPA extracted:', creditResult.senderUpi);
    process.exit(1);
  }

  console.log('\n--- 2. Testing Outgoing Debit Email (Must be dropped) ---');
  const debitResult = await extractPaymentFromEmail(famAppDebitEmail, '');
  console.log('Debit result (should be null):', debitResult);

  if (debitResult !== null) {
    console.error('FAILED: Debit email was not filtered out');
    process.exit(1);
  }

  console.log('\nALL WATCHER PARSER TESTS PASSED!');
})();
