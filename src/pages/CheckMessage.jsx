import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, AlertTriangle, CheckCircle2, AlertCircle,
  Sparkles, ShieldCheck, Flame, Info
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import Tilt3DCard from '../components/Tilt3DCard';
import { analyzeMessage, highlightRiskyWords } from '../utils/messageAnalyzer';
import { sampleMessages } from '../data/scamKeywords';
import confetti from 'canvas-confetti';

const severityConfig = {
  high:   { icon: AlertTriangle, color: '#D9534F', bg: '#FF6B5F', textBg: '#FFF5F5', badge: 'High Threat' },
  medium: { icon: AlertCircle,   color: '#D99A28', bg: '#F7D774', textBg: '#FFFDF0', badge: 'Suspicious' },
  low:    { icon: CheckCircle2, color: '#2E8B68', bg: '#BFE8D2', textBg: '#F2FAF6', badge: 'Safe' },
};

function HighlightedText({ text, riskyWords }) {
  const parts = highlightRiskyWords(text, riskyWords);
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F6F1] border border-[#332A4D]/10 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-[#292433]">
      {parts.map((part, i) =>
        part.highlighted ? (
          <motion.span
            key={i}
            initial={{ scale: 0.95 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            className="inline-block px-1.5 py-0.5 rounded-md font-bold text-[#D9534F] bg-[#FF6B5F]/20 mx-0.5 border border-[#FF6B5F]/40"
          >
            {part.text}
          </motion.span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </div>
  );
}

export default function CheckMessage() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleCheck = async () => {
    if (!message.trim()) return;
    setResult(null);
    setScanning(true);
    setScanProgress(0);

    // 3D Laser scan line travels across message
    for (let i = 0; i <= 100; i += 6) {
      setScanProgress(i);
      await new Promise(r => setTimeout(r, 22));
    }
    setScanning(false);

    const analysis = analyzeMessage(message);
    setResult(analysis);

    if (analysis.riskLevel === 'low') {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }
  };

  const loadSample = (sample) => {
    setMessage(sample.text);
    setResult(null);
  };

  const handleClear = () => {
    setMessage('');
    setResult(null);
  };

  return (
    <div className="pb-16 px-4 py-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDD6F3]/50 text-[#332A4D] text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles size={12} /> 3D Message Scanner
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#211A32] tracking-tight">
            Check a Message
          </h1>
          <p className="text-[#706A78] text-sm mt-1">
            Paste suspicious SMS, WhatsApp, or job texts. Our 3D scanner flags deceptive words in real-time.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="mb-4">
          <p className="text-xs font-bold text-[#9A94A2] uppercase tracking-wider mb-2">
            Try Sample Messages:
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleMessages.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => loadSample(s)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer bg-[#FFFDF9] border border-[#332A4D]/15 text-[#332A4D] hover:bg-[#F8F6F1] hover:border-[#332A4D]/30 shadow-2xs"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── FLOATING 3D MESSAGE CARD ── */}
        <Tilt3DCard
          maxTilt={5}
          depth={15}
          className="mb-6 overflow-hidden relative shadow-md p-0"
        >
          <div className="relative">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Paste message here (e.g. 'Dear Customer, your SBI account KYC has expired...')"
              className="w-full p-5 sm:p-6 resize-none text-sm sm:text-base font-medium text-[#292433] bg-[#FFFDF9] outline-none border-b border-[#332A4D]/10 placeholder:text-[#9A94A2]"
              rows={6}
            />

            {/* 3D Scanning Line traveling vertically across message */}
            {scanning && (
              <motion.div
                className="absolute left-0 right-0 pointer-events-none z-30 flex flex-col items-center"
                style={{ top: `${scanProgress}%` }}
              >
                <div className="w-full h-1.5 bg-[#FF6B5F] shadow-[0_0_16px_rgba(255,107,95,0.85)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFFDF9] bg-[#332A4D] px-2.5 py-0.5 rounded-full mt-1.5 shadow-md">
                  Active Analysis &bull; {scanProgress}%
                </span>
              </motion.div>
            )}
          </div>

          <div className="p-4 bg-[#F8F6F1]/70 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-[#9A94A2] font-semibold">
              {message.trim() ? `${message.length} characters entered` : 'Ready to inspect'}
            </div>

            <div className="flex items-center gap-2">
              {message.trim() && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-[#706A78] hover:bg-[#EDE8DF] transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                className="btn-plum px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                onClick={handleCheck}
                disabled={!message.trim() || scanning}
              >
                <Search size={15} />
                <span>{scanning ? 'Scanning Words...' : 'Check Message'}</span>
              </button>
            </div>
          </div>
        </Tilt3DCard>

        {/* ── ANALYSIS RESULTS ── */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 22, rotateX: 6 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-5"
            >
              {/* 3D Gauge & Verdict */}
              <Tilt3DCard maxTilt={5} depth={14} className="p-6 sm:p-7 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 flex justify-center">
                    <RiskGauge score={result.score} riskLevel={result.riskLevel} />
                  </div>

                  <div className="md:col-span-7 text-center md:text-left">
                    <span
                      className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full text-white inline-block mb-2"
                      style={{
                        backgroundColor:
                          result.riskLevel === 'high' ? '#D9534F' : result.riskLevel === 'medium' ? '#D99A28' : '#2E8B68',
                      }}
                    >
                      {result.riskLevel === 'high' ? 'High Threat Detected' : result.riskLevel === 'medium' ? 'Suspicious Indicators' : 'Looks Safe'}
                    </span>

                    <h3 className="text-xl sm:text-2xl font-black text-[#211A32] mb-2">
                      The Verdict
                    </h3>

                    <p className="text-sm sm:text-base font-semibold text-[#292433] italic bg-[#F8F6F1] p-4 rounded-2xl border border-[#332A4D]/10">
                      "{result.verdict}"
                    </p>
                  </div>
                </div>
              </Tilt3DCard>

              {/* Risky words highlight */}
              {result.allRiskyWords.length > 0 && (
                <div className="surface-card p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-extrabold text-[#211A32] text-sm flex items-center gap-1.5">
                      <Flame size={16} className="text-[#D9534F]" />
                      Highlighted Bait Words ({result.allRiskyWords.length})
                    </h4>
                  </div>
                  <HighlightedText text={message} riskyWords={result.allRiskyWords} />
                </div>
              )}

              {/* Detected Reasons */}
              {result.reasons.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="font-extrabold text-[#211A32] text-sm tracking-wide">
                    Why We Flagged This:
                  </h4>
                  {result.reasons.map((reason) => {
                    const cfg = severityConfig[reason.severity] || severityConfig.medium;
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={reason.id}
                        className="surface-card p-4 flex items-center justify-between shadow-2xs"
                        style={{ borderLeft: `5px solid ${cfg.color}` }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: cfg.textBg, color: cfg.color }}
                          >
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#211A32]">{reason.label}</p>
                            <p className="text-xs text-[#706A78] font-mono mt-0.5">{reason.detail}</p>
                          </div>
                        </div>

                        <span
                          className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase text-white flex-shrink-0 ml-2"
                          style={{ backgroundColor: cfg.color }}
                        >
                          {cfg.badge}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Safe Result State */}
              {result.reasons.length === 0 && (
                <div className="surface-card p-7 text-center bg-[#BFE8D2]/25 border border-[#2E8B68]/30">
                  <div className="text-3xl mb-1">🎉</div>
                  <p className="font-black text-[#2E8B68] text-lg">No Obvious Traps Found</p>
                  <p className="text-xs sm:text-sm text-[#706A78] mt-1 max-w-md mx-auto">
                    This message looks typical, but remember: never share OTPs or transfer money to unverified UPI IDs.
                  </p>
                </div>
              )}

              {/* Actionable Advice Card */}
              <div className="surface-card p-6 bg-[#332A4D] text-[#FFFDF9] rounded-3xl shadow-md">
                <h4 className="font-extrabold text-base mb-3 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#BFE8D2]" />
                  What Should You Do Right Now?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {result.advice.map((tip, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs sm:text-sm font-medium flex items-start gap-2.5"
                    >
                      <span className="text-[#FF6B5F] font-bold">&rarr;</span>
                      <span className="text-white/90">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
