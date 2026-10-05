import { trustedBrands, suspiciousTLDs, suspiciousPathWords, shortenerDomains } from '../data/brandList';

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function homoglyphNormalize(s) {
  return s
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w')
    .replace(/5/g, 's')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/\$/g, 's')
    .replace(/@/g, 'a');
}

export function parseUrl(rawUrl) {
  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) url = 'http://' + url;
  try {
    const parsed = new URL(url);
    const hostParts = parsed.hostname.split('.');
    const tld = '.' + hostParts.slice(-1)[0];
    const domain = hostParts.slice(-2)[0];
    const subdomain = hostParts.slice(0, -2).join('.');

    return {
      protocol: parsed.protocol,
      subdomain,
      domain,
      tld,
      path: parsed.pathname,
      query: parsed.search,
      hash: parsed.hash,
      hostname: parsed.hostname,
      raw: parsed.href,
    };
  } catch {
    return null;
  }
}

export function analyzeUrl(rawUrl) {
  if (!rawUrl.trim()) return null;

  const parsed = parseUrl(rawUrl);
  if (!parsed) {
    return { error: 'Could not parse this URL. Make sure it is a valid web address.' };
  }

  const checks = [];
  let score = 0;

  // Check 1: HTTP vs HTTPS
  const isHttp = parsed.protocol === 'http:';
  checks.push({
    id: 'protocol',
    label: 'Uses HTTP instead of HTTPS',
    status: isHttp ? 'danger' : 'safe',
    detail: isHttp
      ? 'Not secure. Your data sent to this site is not encrypted.'
      : 'Uses HTTPS — connection is encrypted.',
  });
  if (isHttp) score += 15;

  // Check 2: Lookalike domain
  let lookalikeBrand = null;
  const normalizedDomain = homoglyphNormalize(parsed.domain.toLowerCase());
  for (const brand of trustedBrands) {
    const normalizedBrand = homoglyphNormalize(brand.name.toLowerCase());
    const distance = levenshtein(normalizedDomain, normalizedBrand);
    const brandInDomain = parsed.hostname.toLowerCase().includes(brand.name.toLowerCase());
    const domainIsExact = parsed.domain.toLowerCase() === brand.name.toLowerCase();
    if (!domainIsExact && (distance <= 2 || (brandInDomain && !domainIsExact))) {
      lookalikeBrand = brand;
      break;
    }
  }
  checks.push({
    id: 'lookalike',
    label: 'Lookalike domain (brand impersonation)',
    status: lookalikeBrand ? 'danger' : 'safe',
    detail: lookalikeBrand
      ? `This looks like it is pretending to be "${lookalikeBrand.name}" (real site: ${lookalikeBrand.domain}).`
      : 'Domain does not appear to be impersonating a well-known brand.',
    highlightDomain: lookalikeBrand !== null,
  });
  if (lookalikeBrand) score += 30;

  // Check 3: Suspicious TLD
  const suspTLD = suspiciousTLDs.find(t => parsed.tld.toLowerCase() === t.toLowerCase());
  checks.push({
    id: 'tld',
    label: 'Suspicious domain ending (TLD)',
    status: suspTLD ? 'warning' : 'safe',
    detail: suspTLD
      ? `"${parsed.tld}" is often used for free or throwaway domains — commonly used by scammers.`
      : `"${parsed.tld}" is a normal domain ending.`,
  });
  if (suspTLD) score += 15;

  // Check 4: Too many subdomains
  const subdomainCount = parsed.subdomain ? parsed.subdomain.split('.').filter(Boolean).length : 0;
  const tooManySubdomains = subdomainCount > 2;
  checks.push({
    id: 'subdomains',
    label: 'Too many subdomains',
    status: tooManySubdomains ? 'warning' : 'safe',
    detail: tooManySubdomains
      ? `This URL has ${subdomainCount} subdomains. Scammers use this to hide the real domain (e.g., "sbi.real-looking.xyz").`
      : subdomainCount > 0 ? `Has ${subdomainCount} subdomain(s) — looks normal.` : 'No unusual subdomains.',
  });
  if (tooManySubdomains) score += 15;

  // Check 5: "@" or IP address
  const hasAt = rawUrl.includes('@');
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const hasIP = ipRegex.test(parsed.hostname);
  const atOrIp = hasAt || hasIP;
  checks.push({
    id: 'at-ip',
    label: 'Has "@" sign or IP address instead of domain name',
    status: atOrIp ? 'danger' : 'safe',
    detail: hasAt
      ? 'Has an "@" sign in the URL — everything before "@" is ignored by browsers, used to trick people.'
      : hasIP
        ? 'Uses a raw IP address instead of a domain name — real websites rarely do this.'
        : 'No "@" signs or raw IP addresses found.',
  });
  if (atOrIp) score += 25;

  // Check 6: Punycode
  const hasPunycode = parsed.hostname.includes('xn--');
  checks.push({
    id: 'punycode',
    label: 'Uses Punycode (foreign character trick)',
    status: hasPunycode ? 'danger' : 'safe',
    detail: hasPunycode
      ? 'This URL uses "xn--" encoding — scammers use this to make fake domains look exactly like real ones using foreign characters.'
      : 'No Punycode detected.',
  });
  if (hasPunycode) score += 25;

  // Check 7: Shortened link
  const isShortened = shortenerDomains.some(s => parsed.hostname.toLowerCase().includes(s));
  checks.push({
    id: 'shortened',
    label: 'Shortened link (destination hidden)',
    status: isShortened ? 'warning' : 'safe',
    detail: isShortened
      ? 'This is a link shortener. You cannot see where it actually goes. Be very careful.'
      : 'Not a known link shortener.',
  });
  if (isShortened) score += 20;

  // Check 8: Suspicious path words
  const foundPathWords = suspiciousPathWords.filter(w =>
    (parsed.path + parsed.query).toLowerCase().includes(w)
  );
  const hasSuspWords = foundPathWords.length > 0;
  checks.push({
    id: 'path-words',
    label: 'Suspicious words in the link path',
    status: hasSuspWords ? 'warning' : 'safe',
    detail: hasSuspWords
      ? `Found: "${foundPathWords.slice(0, 3).join('", "')}" — scam sites often use these words to look official.`
      : 'No suspicious words found in the link path.',
  });
  if (hasSuspWords) score += foundPathWords.length * 5;

  const finalScore = Math.min(score, 100);
  const riskLevel = finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low';

  const verdicts = {
    high: "This link is shadier than a mango tree in peak summer — and not in a good way. Stay away! 🚨",
    medium: "This link has the suspicious energy of a forwarded WhatsApp message from an unknown uncle. Proceed with caution.",
    low: "Looks reasonably okay, but always think before you click — better safe than sorry!",
  };

  return {
    parsed,
    checks,
    score: finalScore,
    riskLevel,
    verdict: verdicts[riskLevel],
  };
}
