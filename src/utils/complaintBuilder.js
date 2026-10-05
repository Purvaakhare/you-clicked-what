export function buildComplaint(formData) {
  const {
    incidentType,
    date,
    time,
    amountLost,
    paymentMethod,
    bankName,
    transactionId,
    scammerPhone,
    scammerUpiId,
    scammerWebsite,
    scammerSocial,
    description,
    complainantName,
    complainantPhone,
  } = formData;

  const now = new Date();
  const generatedDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const lines = [];

  lines.push('CYBER CRIME COMPLAINT');
  lines.push('='.repeat(50));
  lines.push('');
  lines.push(`Date of Complaint: ${generatedDate}`);
  lines.push('');
  lines.push('TO,');
  lines.push('The Officer-in-Charge,');
  lines.push('Cyber Crime Police Station / National Cyber Crime Helpline (1930)');
  lines.push('');
  lines.push('SUBJECT: Complaint regarding Cyber Crime – ' + (incidentType || 'Online Fraud'));
  lines.push('');
  lines.push('Respected Sir/Madam,');
  lines.push('');
  lines.push('I am writing to formally report a cyber crime incident. The details are as follows:');
  lines.push('');
  lines.push('-'.repeat(50));
  lines.push('SECTION 1: INCIDENT DETAILS');
  lines.push('-'.repeat(50));
  lines.push(`Type of Incident  : ${incidentType || 'Not specified'}`);
  if (date) lines.push(`Date of Incident  : ${date}`);
  if (time) lines.push(`Time of Incident  : ${time}`);
  lines.push('');

  if (amountLost || paymentMethod || bankName || transactionId) {
    lines.push('-'.repeat(50));
    lines.push('SECTION 2: FINANCIAL / TRANSACTION DETAILS');
    lines.push('-'.repeat(50));
    if (amountLost) lines.push(`Amount Lost       : ₹${amountLost}`);
    if (paymentMethod) lines.push(`Payment Method    : ${paymentMethod}`);
    if (bankName) lines.push(`Bank / App Name   : ${bankName}`);
    if (transactionId) lines.push(`Transaction ID    : ${transactionId}`);
    lines.push('');
  }

  if (scammerPhone || scammerUpiId || scammerWebsite || scammerSocial) {
    lines.push('-'.repeat(50));
    lines.push('SECTION 3: SUSPECT / SCAMMER DETAILS');
    lines.push('-'.repeat(50));
    if (scammerPhone) lines.push(`Scammer Phone No. : ${scammerPhone}`);
    if (scammerUpiId) lines.push(`Scammer UPI ID    : ${scammerUpiId}`);
    if (scammerWebsite) lines.push(`Scammer Website   : ${scammerWebsite}`);
    if (scammerSocial) lines.push(`Social Media      : ${scammerSocial}`);
    lines.push('');
  }

  if (description) {
    lines.push('-'.repeat(50));
    lines.push('SECTION 4: DESCRIPTION OF INCIDENT');
    lines.push('-'.repeat(50));
    lines.push(description.trim());
    lines.push('');
  }

  if (complainantName || complainantPhone) {
    lines.push('-'.repeat(50));
    lines.push('SECTION 5: COMPLAINANT DETAILS');
    lines.push('-'.repeat(50));
    if (complainantName) lines.push(`Name              : ${complainantName}`);
    if (complainantPhone) lines.push(`Contact Number    : ${complainantPhone}`);
    lines.push('');
  }

  lines.push('-'.repeat(50));
  lines.push('');
  lines.push('I request you to kindly take immediate action in this matter and help in recovering');
  lines.push('the lost amount and apprehending the culprit(s).');
  lines.push('');
  lines.push('I declare that the information provided above is true to the best of my knowledge.');
  lines.push('');
  lines.push('Thanking you,');
  lines.push('');
  lines.push(complainantName || '[Your Name]');
  lines.push(complainantPhone || '[Your Phone Number]');
  lines.push(generatedDate);

  return lines.join('\n');
}
