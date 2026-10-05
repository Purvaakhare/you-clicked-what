import {
  urgencyWords, sensitiveInfoWords, moneyBaitWords,
  threatWords, feeWords, impersonationWords, suspiciousLinkPatterns
} from '../data/scamKeywords';

const URL_REGEX = /https?:\/\/[^\s]+|www\.[^\s]+/gi;

function findMatches(text, wordList) {
  const lower = text.toLowerCase();
  return wordList.filter(word => lower.includes(word.toLowerCase()));
}

function containsLink(text) {
  const urls = text.match(URL_REGEX) || [];
  const shortened = suspiciousLinkPatterns.some(p => p.test(text));
  return { urls, shortened };
}

export function analyzeMessage(text) {
  if (!text.trim()) return null;

  const reasons = [];
  let score = 0;

  // Rule 1: Urgency
  const urgency = findMatches(text, urgencyWords);
  if (urgency.length > 0) {
    score += Math.min(urgency.length * 12, 20);
    reasons.push({
      id: 'urgency',
      label: 'Creates urgency or time pressure',
      detail: `Found: "${urgency.slice(0, 3).join('", "')}"`,
      words: urgency,
      severity: 'medium',
    });
  }

  // Rule 2: Sensitive info
  const sensitive = findMatches(text, sensitiveInfoWords);
  if (sensitive.length > 0) {
    score += Math.min(sensitive.length * 20, 30);
    reasons.push({
      id: 'sensitive',
      label: 'Asks for OTP, PIN, CVV or passwords',
      detail: `Found: "${sensitive.slice(0, 3).join('", "')}"`,
      words: sensitive,
      severity: 'high',
    });
  }

  // Rule 3: Money bait
  const money = findMatches(text, moneyBaitWords);
  if (money.length > 0) {
    score += Math.min(money.length * 10, 20);
    reasons.push({
      id: 'money',
      label: 'Promises money, prize, or free gifts',
      detail: `Found: "${money.slice(0, 3).join('", "')}"`,
      words: money,
      severity: 'medium',
    });
  }

  // Rule 4: Suspicious links
  const { urls, shortened } = containsLink(text);
  if (urls.length > 0 || shortened) {
    score += shortened ? 20 : 10;
    reasons.push({
      id: 'link',
      label: shortened ? 'Contains a shortened/hidden link' : 'Contains a link — check it before clicking',
      detail: shortened
        ? 'Shortened links hide the real destination. Very suspicious.'
        : `Found ${urls.length} link(s) in the message.`,
      words: [...urls, ...(shortened ? ['bit.ly', 'tinyurl'] : [])],
      severity: shortened ? 'high' : 'medium',
    });
  }

  // Rule 5: Threats
  const threats = findMatches(text, threatWords);
  if (threats.length > 0) {
    score += Math.min(threats.length * 15, 25);
    reasons.push({
      id: 'threats',
      label: 'Makes threats about blocking or legal action',
      detail: `Found: "${threats.slice(0, 3).join('", "')}"`,
      words: threats,
      severity: 'high',
    });
  }

  // Rule 6: Fee scam
  const fees = findMatches(text, feeWords);
  if (fees.length > 0) {
    score += Math.min(fees.length * 15, 25);
    reasons.push({
      id: 'fees',
      label: 'Asks for a registration or advance payment',
      detail: `Found: "${fees.slice(0, 3).join('", "')}"`,
      words: fees,
      severity: 'high',
    });
  }

  // Rule 7: Impersonation
  const impersonation = findMatches(text, impersonationWords);
  if (impersonation.length > 0) {
    score += Math.min(impersonation.length * 5, 15);
    reasons.push({
      id: 'impersonation',
      label: 'Pretends to be a bank, company, or government',
      detail: `Found: "${impersonation.slice(0, 3).join('", "')}"`,
      words: impersonation,
      severity: 'low',
    });
  }

  const finalScore = Math.min(score, 100);
  const riskLevel = finalScore >= 60 ? 'high' : finalScore >= 30 ? 'medium' : 'low';

  const allRiskyWords = reasons.flatMap(r => r.words || []);

  const verdicts = {
    high: [
      "This message is more fake than your friend's 'I'm on my way' when they haven't left home yet. 🚨",
      "This has more red flags than a cricket match interrupted by rain. Definitely a scam!",
      "Even your grandmother who just got a smartphone can tell this is a scam.",
    ],
    medium: [
      "This message is giving us suspicious vibes — like getting homework from a 'friend' who never does homework.",
      "Proceed with extreme caution. This looks fishier than the fish in your college canteen.",
      "We smell something off here. And it's not your roommate's socks.",
    ],
    low: [
      "Looks mostly fine, but always stay alert. No one gives you Rs 10 lakh for free.",
      "This seems okay, but keep your OTP to yourself — always!",
      "Appears safe, but remember: real banks NEVER ask for your OTP.",
    ],
  };

  const verdictList = verdicts[riskLevel];
  const verdict = verdictList[Math.floor(Math.random() * verdictList.length)];

  const advice = {
    high: [
      "Delete this message immediately.",
      "Do NOT click any links or call any numbers in the message.",
      "Do NOT share any personal information.",
      "Block the sender.",
      "Report this number to your telecom provider.",
      "If you already interacted, use the 'I Clicked It!' page.",
    ],
    medium: [
      "Be very careful. Verify through official sources only.",
      "Call the company/bank directly using the number from their official website.",
      "Do not call numbers given in this message.",
      "Do not click any links in this message.",
    ],
    low: [
      "This looks safe, but stay alert.",
      "Never share OTPs or PINs with anyone.",
      "If in doubt, call the company through their official number.",
    ],
  };

  return {
    score: finalScore,
    riskLevel,
    reasons,
    verdict,
    advice: advice[riskLevel],
    allRiskyWords,
  };
}

export function highlightRiskyWords(text, riskyWords) {
  if (!riskyWords || riskyWords.length === 0) return [{ text, highlighted: false }];

  const sorted = [...riskyWords].sort((a, b) => b.length - a.length);
  const escapedWords = sorted.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');

  const parts = text.split(regex);
  return parts.map(part => ({
    text: part,
    highlighted: riskyWords.some(w => w.toLowerCase() === part.toLowerCase()),
  }));
}
