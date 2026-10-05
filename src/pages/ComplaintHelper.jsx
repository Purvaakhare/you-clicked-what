import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Copy, Download, Check, ExternalLink, Shield, FileCheck } from 'lucide-react';
import Tilt3DCard from '../components/Tilt3DCard';
import { buildComplaint } from '../utils/complaintBuilder';

const INCIDENT_TYPES = [
  'Money lost via UPI',
  'Card fraud',
  'OTP shared',
  'Fake job offer',
  'Fake shopping site',
  'Social media account hacked',
  'Fake call or SMS',
  'Other',
];

const PAYMENT_METHODS = ['UPI', 'Debit/Credit Card', 'Net Banking', 'Cash', 'Other'];

const STEPS = [
  { id: 'incident', title: 'What happened?', subtitle: 'Select the primary incident category.' },
  { id: 'timing', title: 'When did it happen?', subtitle: 'Provide incident date and approximate time.' },
  { id: 'money', title: 'Money details', subtitle: 'Optional — how much was lost and through which app/bank?' },
  { id: 'suspect', title: 'Scammer details', subtitle: 'Optional — phone number, UPI ID, or link used by the scammer.' },
  { id: 'description', title: 'What exactly happened?', subtitle: 'Describe the sequence of events in your own words.' },
  { id: 'contact', title: 'Your details', subtitle: 'Optional — complainant details for the formal document.' },
];

const DOCS_CHECKLIST = [
  'Screenshots of chats, WhatsApp conversations, or SMS',
  'Transaction receipts, UPI reference numbers (UTR), or bank SMS',
  'Scammer’s phone number, UPI handle, or profile links',
  'Bank statement showing the unauthorized debit',
];

const WHERE_TO_REPORT = [
  {
    icon: '📞',
    title: 'Call 1930 immediately',
    desc: 'National Cyber Crime Helpline. The faster you dial, the higher the chance banks freeze the scammer’s account.',
    cta: null,
    urgent: true,
  },
  {
    icon: '🌐',
    title: 'cybercrime.gov.in',
    desc: 'File an official cyber incident complaint on the National Cyber Crime Reporting Portal.',
    cta: 'https://cybercrime.gov.in',
    urgent: false,
  },
  {
    icon: '🏦',
    title: 'Inform your bank branch',
    desc: 'Notify your bank fraud desk to flag the account and request a transaction dispute.',
    cta: null,
    urgent: false,
  },
];

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <React.Fragment key={i}>
          <motion.div
            animate={{
              width: i === current ? 28 : 8,
              backgroundColor: i < current ? '#2E8B68' : i === current ? '#332A4D' : '#EDE8DF',
            }}
            className="h-2 rounded-full"
            transition={{ duration: 0.3 }}
          />
          {i < total - 1 && (
            <div
              className="h-0.5 w-3 rounded-full"
              style={{
                backgroundColor: i < current ? '#2E8B68' : '#EDE8DF',
                transition: 'background-color 0.3s',
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function ComplaintHelper() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState({
    incidentType: '',
    date: '',
    time: '',
    amountLost: '',
    paymentMethod: '',
    bankName: '',
    transactionId: '',
    scammerPhone: '',
    scammerUpiId: '',
    scammerWebsite: '',
    scammerSocial: '',
    description: '',
    complainantName: '',
    complainantPhone: '',
  });
  const [complaint, setComplaint] = useState('');
  const [copied, setCopied] = useState(false);
  const [showStamp, setShowStamp] = useState(false);

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleNext = () => {
    setDirection(1);
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 0));
  };

  const handleGenerate = () => {
    const text = buildComplaint(form);
    setComplaint('');
    setShowStamp(false);

    let i = 0;
    const interval = setInterval(() => {
      i += 16;
      setComplaint(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setComplaint(text);
        setTimeout(() => setShowStamp(true), 320);
      }
    }, 12);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(complaint).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([complaint], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybercrime_complaint_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentStepData = STEPS[step];

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'incident':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {INCIDENT_TYPES.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => update('incidentType', type)}
                className={`p-3.5 rounded-2xl text-xs sm:text-sm font-bold text-left transition-all cursor-pointer border ${
                  form.incidentType === type
                    ? 'bg-[#332A4D] text-[#FFFDF9] border-[#332A4D] shadow-sm'
                    : 'bg-[#FFFDF9] hover:bg-[#F8F6F1] border-[#332A4D]/15 text-[#292433]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{type}</span>
                  {form.incidentType === type && (
                    <span className="text-xs text-[#BFE8D2] font-black">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'timing':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-bold text-[#211A32] mb-1.5 block">
                Date of Incident
              </label>
              <input
                type="date"
                value={form.date}
                onChange={e => update('date', e.target.value)}
                className="input-field w-full px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-bold text-[#211A32] mb-1.5 block">
                Approximate Time
              </label>
              <input
                type="time"
                value={form.time}
                onChange={e => update('time', e.target.value)}
                className="input-field w-full px-4 py-3 text-sm"
              />
            </div>
          </div>
        );

      case 'money':
        return (
          <div className="space-y-4">
            <p className="text-xs text-[#9A94A2]">All fields below are optional.</p>
            <div>
              <label className="text-xs sm:text-sm font-bold text-[#211A32] mb-1.5 block">
                Amount Lost (₹)
              </label>
              <input
                type="number"
                value={form.amountLost}
                onChange={e => update('amountLost', e.target.value)}
                placeholder="e.g. 15000"
                className="input-field w-full px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-bold text-[#211A32] mb-1.5 block">
                Payment Channel
              </label>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => update('paymentMethod', method)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      form.paymentMethod === method
                        ? 'bg-[#332A4D] text-[#FFFDF9]'
                        : 'bg-[#F8F6F1] text-[#292433] hover:bg-[#EDE8DF]'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-bold text-[#211A32] mb-1.5 block">
                Bank or App Name
              </label>
              <input
                value={form.bankName}
                onChange={e => update('bankName', e.target.value)}
                placeholder="e.g. SBI, PhonePe, Paytm, HDFC"
                className="input-field w-full px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-bold text-[#211A32] mb-1.5 block">
                Transaction ID / UTR Number
              </label>
              <input
                value={form.transactionId}
                onChange={e => update('transactionId', e.target.value)}
                placeholder="From SMS or bank receipt"
                className="input-field w-full px-4 py-3 text-sm font-mono"
              />
            </div>
          </div>
        );

      case 'suspect':
        return (
          <div className="space-y-4">
            <p className="text-xs text-[#9A94A2]">Provide any scammer details you managed to capture (all optional).</p>
            {[
              { field: 'scammerPhone', label: 'Scammer’s Phone Number', placeholder: '+91 9XXXXXXXXX' },
              { field: 'scammerUpiId', label: 'Scammer’s UPI ID', placeholder: 'scammer@paytm' },
              { field: 'scammerWebsite', label: 'Scammer Website Link', placeholder: 'http://fake-site.xyz' },
              { field: 'scammerSocial', label: 'Social Media / Telegram Handle', placeholder: 'Telegram channel or IG profile' },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="text-xs sm:text-sm font-bold text-[#211A32] mb-1.5 block">{label}</label>
                <input
                  value={form[field]}
                  onChange={e => update(field, e.target.value)}
                  placeholder={placeholder}
                  className="input-field w-full px-4 py-3 text-sm"
                />
              </div>
            ))}
          </div>
        );

      case 'description':
        return (
          <div>
            <label className="text-xs sm:text-sm font-bold text-[#211A32] mb-1.5 block">
              Describe what happened in your own words
            </label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="E.g. On 04-Oct, I received a call claiming my SIM would be blocked within 24 hours. The caller told me to transfer Rs 10 via UPI for verification. Soon after, Rs 15,000 was debited without my consent..."
              className="input-field w-full p-4 text-sm resize-none"
              rows={7}
            />
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <p className="text-xs text-[#9A94A2]">Optional — used to format your final formal complaint document.</p>
            <div>
              <label className="text-xs sm:text-sm font-bold text-[#211A32] mb-1.5 block">Your Name</label>
              <input
                value={form.complainantName}
                onChange={e => update('complainantName', e.target.value)}
                placeholder="Full name as in bank records"
                className="input-field w-full px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-bold text-[#211A32] mb-1.5 block">Your Phone Number</label>
              <input
                value={form.complainantPhone}
                onChange={e => update('complainantPhone', e.target.value)}
                placeholder="+91 9XXXXXXXXX"
                className="input-field w-full px-4 py-3 text-sm"
              />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#BFE8D2]/30 border border-[#2E8B68]/20 flex items-start gap-2.5 text-xs text-[#292433]">
              <Shield size={16} className="text-[#2E8B68] flex-shrink-0 mt-0.5" />
              <span>
                <strong>100% Client-Side Privacy:</strong> Nothing is ever stored in database or local storage.
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ── 3D FLOATING PAPER DOCUMENT PREVIEW ── */
  if (complaint) {
    return (
      <div className="pb-16 px-4 py-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6 text-center sm:text-left">
            <span className="text-xs font-black uppercase text-[#211A32] bg-[#BFE8D2] px-3 py-1 rounded-full">
              Formal Document
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#211A32] tracking-tight mt-2">
              Your Formatted Cyber Complaint
            </h1>
            <p className="text-[#706A78] text-sm mt-1">
              Copy this document or download as a text file to submit at <strong className="text-[#211A32]">cybercrime.gov.in</strong>.
            </p>
          </div>

          {/* 3D Paper Sheet with Bouncy READY Stamp */}
          <div className="relative mb-6" style={{ perspective: 1200 }}>
            <motion.div
              initial={{ y: 50, rotateX: 16, opacity: 0 }}
              animate={{ y: 0, rotateX: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            >
              <div className="surface-card p-6 sm:p-8 relative overflow-hidden bg-[#FFFDF9] border border-[#332A4D]/15 shadow-xl">
                {/* READY Stamp with Physical Bounce */}
                <AnimatePresence>
                  {showStamp && (
                    <motion.div
                      initial={{ scale: 3.5, opacity: 0, rotate: -30 }}
                      animate={{ scale: 1, opacity: 0.9, rotate: -12 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 18 }}
                      className="absolute top-6 right-6 border-4 border-[#332A4D] text-[#332A4D] rounded-xl px-4 py-1 font-black text-xl tracking-widest pointer-events-none select-none z-20 shadow-sm"
                    >
                      READY
                    </motion.div>
                  )}
                </AnimatePresence>

                <pre className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-[#292433] max-h-[460px] overflow-y-auto">
                  {complaint}
                </pre>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons: Copy & Download */}
          <div className="flex flex-col sm:flex-row gap-3.5 mb-6">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 btn-plum py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied to Clipboard ✓' : 'Copy Complaint'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 btn-outline py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Download size={16} />
              <span>Download .txt File</span>
            </button>
          </div>

          {/* Evidence Checklist */}
          <div className="surface-card p-6 mb-5 shadow-sm">
            <h3 className="font-extrabold text-[#211A32] text-sm mb-3">📋 Evidence to Attach at cybercrime.gov.in</h3>
            <ul className="space-y-2">
              {DOCS_CHECKLIST.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#706A78] font-medium">
                  <span className="text-[#FF6B5F] font-bold mt-0.5">&rarr;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Where to file */}
          <div className="space-y-3 mb-5">
            <h3 className="font-extrabold text-[#211A32] text-sm">Official Reporting Channels</h3>
            {WHERE_TO_REPORT.map((r, i) => (
              <div
                key={i}
                className="surface-card p-4 sm:p-5 flex items-start gap-4 shadow-2xs"
                style={
                  r.urgent
                    ? {
                        border: '1.5px solid rgba(255, 107, 95, 0.4)',
                        backgroundColor: '#FFF5F5',
                      }
                    : {}
                }
              >
                <div className="text-2xl sm:text-3xl">{r.icon}</div>
                <div className="flex-1">
                  <p className={`font-black text-sm mb-0.5 ${r.urgent ? 'text-[#D9534F]' : 'text-[#211A32]'}`}>
                    {r.title}
                  </p>
                  <p className={`text-xs leading-relaxed ${r.urgent ? 'text-[#706A78]' : 'text-[#706A78]'}`}>
                    {r.desc}
                  </p>
                </div>
                {r.cta && (
                  <a
                    href={r.cta}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-[#332A4D] hover:text-[#FF6B5F]"
                  >
                    <ExternalLink size={17} />
                  </a>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setComplaint('');
              setStep(0);
              setForm(Object.fromEntries(Object.keys(form).map(k => [k, ''])));
            }}
            className="w-full btn-outline py-3.5 rounded-2xl text-sm font-bold cursor-pointer"
          >
            &larr; Draft Another Complaint
          </button>
        </motion.div>
      </div>
    );
  }

  /* ── GUIDED WIZARD STEPS ── */
  return (
    <div className="pb-16 px-4 py-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 text-center sm:text-left">
          <span className="text-xs font-black uppercase text-[#211A32] bg-[#BFE8D2] px-3 py-1 rounded-full">
            Guided Wizard
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#211A32] tracking-tight mt-2">
            Complaint Helper
          </h1>
          <p className="text-[#706A78] text-sm mt-1">
            Answer a few quick questions to generate your official complaint draft.
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator current={step} total={STEPS.length} />

        {/* Stack-slide card step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 24 }}
            transition={{ duration: 0.25 }}
          >
            <Tilt3DCard maxTilt={4} depth={10} className="p-6 sm:p-7 mb-5 shadow-sm">
              <h2 className="font-extrabold text-[#211A32] text-lg mb-1">{currentStepData.title}</h2>
              <p className="text-xs sm:text-sm text-[#706A78] mb-5">{currentStepData.subtitle}</p>
              {renderStepContent()}
            </Tilt3DCard>
          </motion.div>
        </AnimatePresence>

        {/* Wizard Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="btn-outline px-5 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 btn-plum py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Next Section</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              className="flex-1 btn-plum py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Generate Formal Complaint</span>
              <FileCheck size={17} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
