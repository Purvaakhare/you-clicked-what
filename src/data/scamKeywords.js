// Scam keyword data for message analysis

export const urgencyWords = [
  'today', 'immediately', 'expires', 'last chance', 'within 24 hours',
  'urgent', 'hurry', 'act now', 'limited time', 'deadline', 'asap',
  'right now', 'instant', 'quick', 'fast', 'expiry', 'expired',
  'within 48 hours', 'within hours', 'before midnight', 'final notice'
];

export const sensitiveInfoWords = [
  'otp', 'pin', 'cvv', 'password', 'card number', 'account number',
  'passcode', 'security code', 'verification code', 'secret code',
  'net banking', 'login id', 'username', 'atm pin', 'debit card',
  'credit card', 'bank details', 'aadhar', 'pan card', 'passbook'
];

export const moneyBaitWords = [
  'won', 'winner', 'lottery', 'cashback', 'free gift', 'refund',
  'prize', 'reward', 'jackpot', 'congratulations', 'selected',
  'eligible', 'lucky', 'bonus', 'offer', 'discount', 'free',
  'earn', 'income', 'salary', 'per day', 'work from home',
  'lakh', 'crore', 'cash prize', 'gift card', 'voucher'
];

export const threatWords = [
  'account blocked', 'kyc expired', 'sim will be disabled', 'legal action',
  'suspended', 'deactivated', 'terminate', 'court', 'fir', 'arrest',
  'penalty', 'fine', 'blocked', 'frozen', 'disabled', 'banned',
  'cancelled', 'disconnected', 'notice', 'action taken', 'complaint filed'
];

export const feeWords = [
  'registration fee', 'advance payment', 'processing fee', 'joining fee',
  'security deposit', 'token amount', 'booking amount', 'charge',
  'fees required', 'pay first', 'refundable deposit', 'activation fee',
  'insurance amount', 'customs duty', 'clearance fee'
];

export const impersonationWords = [
  'bank', 'paytm', 'phonepe', 'amazon', 'courier', 'government',
  'sbi', 'hdfc', 'icici', 'axis', 'rbi', 'sebi', 'income tax',
  'irdai', 'trai', 'bsnl', 'airtel', 'jio', 'flipkart', 'myntra',
  'swiggy', 'zomato', 'uber', 'ola', 'naukri', 'linkedin',
  'whatsapp', 'facebook', 'instagram', 'google', 'microsoft',
  'police', 'cbi', 'ed', 'narcotics', 'customs', 'post office'
];

export const suspiciousLinkPatterns = [
  /bit\.ly/i, /tinyurl/i, /goo\.gl/i, /t\.co/i, /ow\.ly/i,
  /is\.gd/i, /buff\.ly/i, /adf\.ly/i, /bc\.vc/i, /tiny\.cc/i,
  /rb\.gy/i, /cutt\.ly/i, /shorturl/i, /clck\.ru/i
];

export const commonScamChips = [
  'Fake KYC SMS',
  'UPI collect request trick',
  'Fake job fee',
  'Delivery failed link',
  'Lottery prize',
  'Electricity bill threat',
  'Fake customer care',
  'Investment fraud',
  'Part-time job scam',
  'Refund scam',
  'Courier parcel fraud',
  'Screen share scam',
];

export const sampleMessages = [
  {
    label: '🚨 Scam 1: KYC Alert',
    text: 'Dear Customer, Your SBI account KYC has expired. Your account will be blocked within 24 hours. Click here to update KYC immediately: bit.ly/sbi-kyc-update and share your OTP to verify. Urgent action required.',
  },
  {
    label: '🚨 Scam 2: Lottery Prize',
    text: 'Congratulations! You have won Rs 10 lakh in the Amazon Lucky Draw 2024. You are selected as a lucky winner. Pay a registration fee of Rs 500 to claim your prize. Contact us immediately on WhatsApp: 9XXXXXXXXX',
  },
  {
    label: '✅ Safe: Bank Notification',
    text: 'Your account XXXXXX1234 has been credited with Rs 5,000 on 04-Oct-2024. Available balance: Rs 12,500. If not done by you, call 1800-XXX-XXXX. -SBI',
  },
];
