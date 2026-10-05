// Brand list for URL lookalike detection
export const trustedBrands = [
  { name: 'google', domain: 'google.com' },
  { name: 'paytm', domain: 'paytm.com' },
  { name: 'phonepe', domain: 'phonepe.com' },
  { name: 'sbi', domain: 'sbi.co.in' },
  { name: 'hdfcbank', domain: 'hdfcbank.com' },
  { name: 'icicibank', domain: 'icicibank.com' },
  { name: 'axisbank', domain: 'axisbank.com' },
  { name: 'amazon', domain: 'amazon.in' },
  { name: 'flipkart', domain: 'flipkart.com' },
  { name: 'instagram', domain: 'instagram.com' },
  { name: 'facebook', domain: 'facebook.com' },
  { name: 'whatsapp', domain: 'whatsapp.com' },
  { name: 'twitter', domain: 'twitter.com' },
  { name: 'youtube', domain: 'youtube.com' },
  { name: 'microsoft', domain: 'microsoft.com' },
  { name: 'apple', domain: 'apple.com' },
  { name: 'netflix', domain: 'netflix.com' },
  { name: 'irctc', domain: 'irctc.co.in' },
  { name: 'naukri', domain: 'naukri.com' },
  { name: 'zomato', domain: 'zomato.com' },
  { name: 'swiggy', domain: 'swiggy.com' },
];

export const suspiciousTLDs = ['.xyz', '.top', '.click', '.tk', '.ml', '.ga', '.cf', '.gq', '.pw', '.info', '.biz'];

export const suspiciousPathWords = ['login', 'verify', 'update', 'kyc', 'secure', 'free', 'gift', 'claim', 'prize', 'reward', 'confirm', 'validate', 'auth', 'signin', 'account', 'password', 'reset'];

export const shortenerDomains = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 'adf.ly', 'bc.vc', 'tiny.cc', 'rb.gy', 'cutt.ly', 'shorturl.at', 'clck.ru', 'soo.gd', 't.ly', 'v.gd', 'bl.ink'];

export const sampleUrls = [
  {
    label: '✅ Safe: Google',
    url: 'https://www.google.com/search?q=cybercrime+india',
  },
  {
    label: '🚨 Scam 1: Fake SBI',
    url: 'http://sbi-kyc-update.xyz/login?verify=otp&secure=true',
  },
  {
    label: '🚨 Scam 2: Shortened',
    url: 'https://bit.ly/free-gift-claim-now',
  },
];
