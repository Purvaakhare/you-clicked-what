import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, AlertTriangle, AlertCircle, Info, Sparkles } from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import UrlTiles from '../components/UrlTiles';
import Tilt3DCard from '../components/Tilt3DCard';
import { analyzeUrl } from '../utils/urlAnalyzer';
import { sampleUrls } from '../data/brandList';

const statusConfig = {
  safe:    { icon: CheckCircle2, color: '#2E8B68', bg: '#BFE8D2', label: 'Safe' },
  warning: { icon: AlertCircle,   color: '#D99A28', bg: '#F7D774', label: 'Suspicious' },
  danger:  { icon: AlertTriangle, color: '#D9534F', bg: '#FF6B5F', label: 'Danger' },
};

export default function CheckLink() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setResult(null);
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 700));
    setAnalyzing(false);
    const analysis = analyzeUrl(url);
    setResult(analysis);
  };

  const loadSample = (sample) => {
    setUrl(sample.url);
    setResult(null);
  };

  const isLookalike = result?.checks?.some(c => c.id === 'lookalike' && c.status === 'danger');

  return (
    <div className="pb-16 px-4 py-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDD6F3]/50 text-[#332A4D] text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles size={12} /> 3D URL Dissector
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#211A32] tracking-tight">
            Check a Link
          </h1>
          <p className="text-[#706A78] text-sm mt-1">
            Copy the link and inspect it safely. Watch our engine physically separate and inspect every URL segment.
          </p>
        </div>

        {/* Tip Box */}
        <div className="flex items-start gap-2.5 mb-5 p-3.5 rounded-2xl text-xs text-[#332A4D] font-medium bg-[#BFE8D2]/35 border border-[#2E8B68]/20">
          <Info size={16} className="flex-shrink-0 mt-0.5 text-[#2E8B68]" />
          <span>
            <strong>Pro Tip:</strong> Right-click or long-press the link in WhatsApp/SMS &rarr; select <strong>Copy Link Address</strong>, then paste below.
          </span>
        </div>

        {/* Preset Sample URLs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {sampleUrls.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => loadSample(s)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer bg-[#FFFDF9] border border-[#332A4D]/15 text-[#332A4D] hover:bg-[#F8F6F1] shadow-2xs"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* URL Input Box with 3D Tilt */}
        <Tilt3DCard maxTilt={4} depth={12} className="p-4 sm:p-5 mb-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Paste link here (e.g. http://sbi-kyc-update.xyz/login)"
              className="input-field flex-1 px-4 py-3 text-sm font-mono"
              onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
            />
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!url.trim() || analyzing}
              className="btn-plum px-6 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Search size={15} />
              <span>{analyzing ? 'Inspecting Segments...' : 'Analyze Link'}</span>
            </button>
          </div>
        </Tilt3DCard>

        {/* ── ANALYSIS RESULTS ── */}
        <AnimatePresence>
          {result && !result.error && (
            <motion.div
              initial={{ opacity: 0, y: 22, rotateX: 6 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-5"
            >
              {/* Floating 3D Segmented Tiles with Moving Magnifying Glass */}
              <Tilt3DCard maxTilt={4} depth={15} className="p-6 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-extrabold text-[#211A32] text-sm">
                    🔍 3D Link Dissector &amp; Inspector
                  </h3>
                  <span className="text-[11px] text-[#9A94A2] font-semibold">Active Magnifying Scanner</span>
                </div>
                <UrlTiles parsed={result.parsed} isLookalike={isLookalike} />
              </Tilt3DCard>

              {/* Gauge and Verdict Card */}
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
                      {result.riskLevel === 'high' ? 'Phishing Threat' : result.riskLevel === 'medium' ? 'Proceed With Caution' : 'Looks Clean'}
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

              {/* 8 Security Checks Rows */}
              <div className="space-y-2.5">
                <h3 className="font-extrabold text-[#211A32] text-sm">
                  Security Check Inspector
                </h3>
                {result.checks.map((check) => {
                  const cfg = statusConfig[check.status] || statusConfig.safe;
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={check.id}
                      className="surface-card p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs"
                      style={{ borderLeft: `5px solid ${cfg.color}` }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-bold text-[#211A32]">{check.label}</span>
                          <span
                            className="text-[10px] font-black px-2 py-0.5 rounded-full text-white uppercase"
                            style={{ backgroundColor: cfg.color }}
                          >
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-[#706A78] leading-relaxed">{check.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {result && result.error && (
            <div className="surface-card p-5 text-center bg-[#FF6B5F]/15 border border-[#D9534F]/30">
              <p className="font-bold text-[#D9534F]">⚠️ {result.error}</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
