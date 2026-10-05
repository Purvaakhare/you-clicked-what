import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Key, Globe, Smartphone, IndianRupee, Check, ChevronRight, ArrowRight, RotateCcw, Shield } from 'lucide-react';
import { clickedItScenarios } from '../data/checklists';
import confetti from 'canvas-confetti';

const ICONS = { Link, Key, Globe, Smartphone, IndianRupee };

const scenarioColors = {
  red:   { badgeBg: '#FF6B5F', badgeText: '#FFFFFF', iconBg: '#FF6B5F', iconColor: '#FFFDF9' },
  amber: { badgeBg: '#F7D774', badgeText: '#332A4D', iconBg: '#F7D774', iconColor: '#211A32' },
};

function ShieldProgressMeter({ progress, isComplete }) {
  return (
    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8F6F1] border border-[#332A4D]/10">
      <div className="relative w-8 h-10 flex-shrink-0">
        <svg viewBox="0 0 100 120" className="w-full h-full">
          <defs>
            <clipPath id="warmShieldClip">
              <path d="M50 6 L90 22 L90 55 Q90 90 50 114 Q10 90 10 55 L10 22 Z" />
            </clipPath>
          </defs>
          <path
            d="M50 6 L90 22 L90 55 Q90 90 50 114 Q10 90 10 55 L10 22 Z"
            fill="#EDE8DF"
            stroke="#D6CEBF"
            strokeWidth="3"
          />
          <g clipPath="url(#warmShieldClip)">
            <motion.rect
              x="0"
              width="100"
              initial={{ y: 120, height: 0 }}
              animate={{
                y: 120 - (progress / 100) * 120,
                height: (progress / 100) * 120,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              fill={isComplete ? '#2E8B68' : '#332A4D'}
            />
          </g>
        </svg>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-[#211A32]">Lockdown Progress</span>
          <span className="text-xs font-black text-[#332A4D]">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden bg-[#EDE8DF]">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: isComplete ? '#2E8B68' : '#332A4D',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ClickedIt({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState({});
  const [done, setDone] = useState(false);

  const scenario = clickedItScenarios.find(s => s.id === selected);
  const totalSteps = scenario ? scenario.steps.length : 0;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = totalSteps > 0 ? (checkedCount / totalSteps) * 100 : 0;

  const toggleStep = (stepId) => {
    const newChecked = { ...checked, [stepId]: !checked[stepId] };
    setChecked(newChecked);
    const allDone = scenario.steps.every(s => newChecked[s.id]);
    if (allDone && !done) {
      setDone(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else if (!allDone) {
      setDone(false);
    }
  };

  const handleSelect = (id) => {
    setSelected(id);
    setChecked({});
    setDone(false);
  };

  const handleBack = () => {
    setSelected(null);
    setChecked({});
    setDone(false);
  };

  return (
    <div className="pb-16 px-4 py-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BFE8D2] text-[#211A32] text-xs font-black uppercase tracking-wider mb-2">
            <span>🛡️</span> Incident Lockdown Checklist
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#211A32] tracking-tight">
            I Already Clicked It!
          </h1>
          <p className="text-[#706A78] text-sm mt-1">
            <strong>Do not panic.</strong> Follow the steps below in order to freeze accounts and minimize financial damage.
          </p>
        </div>

        {/* ── SCENARIOS SELECTION ── */}
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {clickedItScenarios.map((item, i) => {
                const Icon = ICONS[item.icon] || Link;
                const colors = scenarioColors[item.color] || scenarioColors.amber;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="cursor-pointer"
                    onClick={() => handleSelect(item.id)}
                  >
                    <div className="surface-card surface-card-interactive p-5 sm:p-6 h-full flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: colors.iconBg, color: colors.iconColor }}
                      >
                        <Icon size={22} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h3 className="font-extrabold text-[#211A32] text-base">{item.title}</h3>
                          <ChevronRight size={16} className="text-[#9A94A2]" />
                        </div>
                        <p className="text-xs sm:text-sm text-[#706A78] leading-relaxed font-medium">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* ── CHECKLIST VIEW ── */
            <motion.div
              key="checklist"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Back to scenarios */}
              <button
                type="button"
                onClick={handleBack}
                className="mb-4 text-xs font-bold text-[#332A4D] hover:text-[#211A32] flex items-center gap-1.5 cursor-pointer bg-[#FFFDF9] px-3 py-1.5 rounded-full border border-[#332A4D]/10"
              >
                <RotateCcw size={12} />
                <span>Choose another situation</span>
              </button>

              {/* Header card with progress meter */}
              <div className="surface-card p-6 mb-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-extrabold text-[#211A32] text-xl">{scenario.title}</h2>
                    <p className="text-xs sm:text-sm text-[#706A78] font-medium">{scenario.subtitle}</p>
                  </div>
                  <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-[#DDD6F3] text-[#211A32]">
                    Priority Steps
                  </span>
                </div>

                <ShieldProgressMeter progress={progress} isComplete={done} />

                {/* Done message */}
                <AnimatePresence>
                  {done && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-2xl bg-[#BFE8D2]/40 border border-[#2E8B68]/30 text-center"
                    >
                      <p className="font-black text-[#2E8B68] text-base">🎉 Great! You handled the immediate threats.</p>
                      <p className="text-xs text-[#292433] mt-1">
                        Now, if funds were debited or accounts compromised, generate a formal complaint.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Checklist items */}
              <div className="space-y-3">
                {scenario.steps
                  .sort((a, b) => a.priority - b.priority)
                  .map((step) => {
                    const isChecked = !!checked[step.id];
                    return (
                      <div
                        key={step.id}
                        onClick={() => toggleStep(step.id)}
                        className={`surface-card p-4 sm:p-5 cursor-pointer transition-all ${
                          isChecked ? 'bg-[#BFE8D2]/20 border-[#2E8B68]/30 opacity-75' : ''
                        }`}
                        style={{
                          borderLeft: `5px solid ${
                            isChecked ? '#2E8B68' : step.priority === 1 ? '#D9534F' : '#332A4D'
                          }`,
                        }}
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Custom Checkbox */}
                          <div
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                              isChecked ? 'bg-[#2E8B68] border-[#2E8B68] text-white' : 'border-[#9A94A2] bg-white'
                            }`}
                          >
                            {isChecked && <Check size={14} strokeWidth={3.5} />}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {step.priority === 1 && (
                                <span className="text-[10px] font-black text-white bg-[#D9534F] px-2 py-0.5 rounded-full uppercase">
                                  Urgent Step 1
                                </span>
                              )}
                              <span
                                className={`text-sm sm:text-base font-bold ${
                                  isChecked ? 'line-through text-[#9A94A2]' : 'text-[#211A32]'
                                }`}
                              >
                                {step.text}
                              </span>
                            </div>
                            <p className="text-xs text-[#706A78] leading-relaxed font-medium">
                              {step.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Next: Complaint Helper Button */}
              {done && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => onNavigate('complaint')}
                    className="btn-plum w-full py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer text-sm sm:text-base font-bold"
                  >
                    <span>Write My Formal Complaint</span>
                    <ArrowRight size={17} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
