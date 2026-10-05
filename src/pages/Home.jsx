import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Link2, MousePointerClick, PhoneCall, ExternalLink,
  Sparkles, ArrowRight, HelpCircle
} from 'lucide-react';
import DigitalGuardian from '../components/DigitalGuardian';
import Tilt3DCard from '../components/Tilt3DCard';
import { commonScamChips } from '../data/scamKeywords';
import confetti from 'canvas-confetti';

const HOW_IT_WORKS = [
  {
    icon: MessageSquare,
    badge: 'SMS / WHATSAPP',
    title: 'Check a Message',
    desc: 'Paste suspicious texts claiming KYC expiry or lottery cash. Our scanner analyzes urgency traps and bait keywords without storing data.',
    page: 'check-message',
    pill: 'Analyze SMS',
    accent: '#FF6B5F',
  },
  {
    icon: Link2,
    badge: 'URL INSPECTION',
    title: 'Check a Link',
    desc: 'Check deceptive URLs mimicking SBI, Paytm or Amazon. Breaks links into 3D segments and flags lookalikes safely.',
    page: 'check-link',
    pill: 'Inspect URL',
    accent: '#7567C7',
  },
  {
    icon: MousePointerClick,
    badge: 'ACCIDENTAL CLICK',
    title: 'I Already Clicked!',
    desc: 'Shared an OTP or downloaded a weird APK? Follow a calm priority recovery checklist to block your accounts in 5 minutes.',
    page: 'clicked-it',
    pill: 'Emergency Steps',
    accent: '#2E8B68',
  },
  {
    icon: PhoneCall,
    badge: '1930 HELPLINE',
    title: 'Complaint Helper',
    desc: 'Lost money? Generate a clear, formally formatted complaint letter in 60 seconds ready to submit at cybercrime.gov.in.',
    page: 'complaint',
    pill: 'Draft FIR / Report',
    accent: '#D99A28',
  },
];

// Interactive Scam IQ Challenge for Students
const SCAM_QUIZ = [
  {
    question: "You receive an SMS: 'Your Electricity bill is unpaid. Power cut tonight. Call officer at 9876543210'. Is this real?",
    options: [
      { text: "Fake! State electricity boards never share personal mobile numbers for bill payments.", correct: true },
      { text: "Real, I should immediately call and pay on GooglePay/PhonePe.", correct: false }
    ],
    hint: "Official power utility companies only send updates via verified sender IDs (e.g. BSES-DL, MSEDCL), never personal 10-digit mobile numbers."
  },
  {
    question: "A stranger says: 'I sent you a Rs 1,000 UPI QR code. Scan it and enter UPI PIN to receive money.'",
    options: [
      { text: "Entering UPI PIN only DEDUCTS money from your bank account!", correct: true },
      { text: "Yes, your UPI PIN is needed to receive incoming payments.", correct: false }
    ],
    hint: "Golden Cybersecurity Rule: You NEVER need to enter your secret UPI PIN to receive money."
  },
  {
    question: "An unknown Instagram message: 'Like 3 YouTube videos, get Rs 1,500 per day from home'.",
    options: [
      { text: "Part-time job scam. They build trust with small payments then steal thousands via Telegram groups.", correct: true },
      { text: "Legitimate freelance remote job opportunity.", correct: false }
    ],
    hint: "Task-based scams pay Rs 150 initially, then demand 'security recharge deposits' of Rs 10,000+ that cannot be withdrawn."
  }
];

export default function Home({ onNavigate }) {
  const [isMobile, setIsMobile] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleQuizChoice = (isCorrect, index) => {
    setQuizSelected(index);
    setQuizAnswered(true);
    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const nextQuiz = () => {
    setQuizSelected(null);
    setQuizAnswered(false);
    setQuizIndex((prev) => (prev + 1) % SCAM_QUIZ.length);
  };

  const chips = [...commonScamChips, ...commonScamChips];

  return (
    <div className="pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* ── 1. EDITORIAL HERO SECTION ── */}
      <section className="pt-6 sm:pt-14 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <motion.div
            className="lg:col-span-7 text-center lg:text-left"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Friendly Pill Tag */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold mb-5 bg-[#DDD6F3]/50 text-[#332A4D] border border-[#332A4D]/10 select-none"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF6B5F]" />
              <span>Cybersecurity Helper for Indian Students</span>
              <Sparkles size={13} className="text-[#332A4D]" />
            </motion.div>

            {/* Giant Editorial Headline */}
            <h1 className="font-extrabold tracking-tight leading-[1.05] text-5xl sm:text-6xl lg:text-7xl text-[#211A32] mb-5">
              You Clicked <br />
              <span className="relative inline-block text-[#332A4D]">
                WHAT?!
                {/* Hand-drawn Underline in Coral Accent */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-4 text-[#FF6B5F] overflow-visible"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,8 Q50,0 100,8"
                    stroke="#FF6B5F"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Sub-headline text */}
            <p className="text-base sm:text-lg text-[#706A78] mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Check before you click. Fix damage immediately after an accidental tap.
              Draft formal police complaints in minutes. <strong className="text-[#211A32]">Zero technical jargon, 100% private in your browser.</strong>
            </p>

            {/* Two Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start items-center">
              <motion.button
                whileHover={{ scale: 1.025, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('check-message')}
                className="w-full sm:w-auto btn-plum px-7 py-4 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md"
              >
                <MessageSquare size={18} className="text-[#BFE8D2]" />
                <span>Check a Message</span>
                <ArrowRight size={16} className="text-white/70" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.025, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('check-link')}
                className="w-full sm:w-auto btn-outline px-7 py-4 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2.5"
              >
                <Link2 size={18} className="text-[#332A4D]" />
                <span>Check a Link</span>
              </motion.button>
            </div>

            {/* Trust Anchors */}
            <div className="mt-10 pt-6 border-t border-[#332A4D]/10 grid grid-cols-3 gap-3 text-center lg:text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#211A32]">0 KB</p>
                <p className="text-xs font-semibold text-[#706A78]">Data Stored (100% Local)</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#FF6B5F]">1930</p>
                <p className="text-xs font-semibold text-[#706A78]">Official Cyber Helpline</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#2E8B68]">&lt; 1 sec</p>
                <p className="text-xs font-semibold text-[#706A78]">Fast Rule-Based Scanner</p>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Column: 3D Guardian with Scanning Rings */}
          <motion.div
            className="lg:col-span-5 flex justify-center items-center relative"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <DigitalGuardian isMobile={isMobile} />
          </motion.div>
        </div>
      </section>

      {/* ── 2. 3D TILT FEATURE CARDS SECTION ── */}
      <section className="py-10 sm:py-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#BFE8D2] text-[#211A32]">
            Interactive Toolkit
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#211A32] mt-2 tracking-tight">
            Everything You Need When In Doubt
          </h2>
          <p className="text-sm text-[#706A78] font-medium mt-1">
            Hover cards to feel the subtle 3D physical depth. Click any tool to begin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW_IT_WORKS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Tilt3DCard
                key={item.title}
                maxTilt={6}
                depth={16}
                className="cursor-pointer h-full"
                onClick={() => onNavigate(item.page)}
              >
                <div className="p-6 h-full flex flex-col justify-between group">
                  <div>
                    {/* Top Icon with colored backing */}
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: [-4, 4, 0] }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: item.accent }}
                      >
                        <Icon size={22} />
                      </motion.div>
                      <span className="text-[10px] font-black uppercase text-[#9A94A2]">
                        0{i + 1}
                      </span>
                    </div>

                    <p className="text-[11px] font-black tracking-wider uppercase text-[#706A78] mb-1">
                      {item.badge}
                    </p>
                    <h3 className="text-lg font-black text-[#211A32] mb-2 group-hover:text-[#FF6B5F] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#706A78] leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#332A4D]/5 flex items-center justify-between text-xs font-bold text-[#332A4D]">
                    <span>{item.pill}</span>
                    <ArrowRight size={14} className="text-[#332A4D] group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Tilt3DCard>
            );
          })}
        </div>
      </section>

      {/* ── 3. INTERACTIVE SCAM IQ CHALLENGE (QUIZ) ── */}
      <section className="py-8 sm:py-12">
        <Tilt3DCard maxTilt={4} depth={12} className="p-6 sm:p-9 border border-[#332A4D]/10 bg-gradient-to-br from-[#FFFDF9] via-[#FFFDF9] to-[#DDD6F3]/20 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#332A4D]/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7D774]/60 text-[#332A4D] text-[11px] font-black uppercase tracking-wider mb-1">
                <HelpCircle size={13} /> Quick Cyber IQ Check
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#211A32]">
                Can You Spot The Scam? (Question {quizIndex + 1}/{SCAM_QUIZ.length})
              </h3>
            </div>
            <span className="text-xs font-bold text-[#706A78] bg-[#F8F6F1] px-3 py-1.5 rounded-full border border-[#332A4D]/10">
              Test your instincts
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-base sm:text-lg font-bold text-[#292433] leading-snug">
              "{SCAM_QUIZ[quizIndex].question}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {SCAM_QUIZ[quizIndex].options.map((opt, idx) => {
                const isChosen = quizSelected === idx;
                let btnStyle = 'bg-[#FFFDF9] hover:bg-[#F8F6F1] border-[#332A4D]/15 text-[#292433]';

                if (quizAnswered) {
                  if (opt.correct) {
                    btnStyle = 'bg-[#BFE8D2]/50 border-[#2E8B68] text-[#2E8B68] font-black ring-2 ring-[#2E8B68]/30';
                  } else if (isChosen && !opt.correct) {
                    btnStyle = 'bg-[#FF6B5F]/15 border-[#D9534F] text-[#D9534F] font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={quizAnswered}
                    onClick={() => handleQuizChoice(opt.correct, idx)}
                    className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs ${btnStyle}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#F8F6F1] text-[#332A4D] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {quizAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#332A4D]/10 shadow-xs mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#706A78]">
                    <span className="text-lg">💡</span>
                    <div>
                      <strong className="text-[#332A4D] block font-black">Cyber Insight:</strong>
                      <span>{SCAM_QUIZ[quizIndex].hint}</span>
                    </div>
                  </div>

                  <button
                    onClick={nextQuiz}
                    className="btn-plum text-white text-xs font-extrabold px-4 py-2.5 rounded-xl whitespace-nowrap cursor-pointer shadow-sm self-end sm:self-center"
                  >
                    Next Question &rarr;
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tilt3DCard>
      </section>

      {/* ── 4. COMMON SCAMS SCROLLING STRIP ── */}
      <section className="py-6 overflow-hidden">
        <h4 className="text-center font-extrabold text-[#9A94A2] text-xs tracking-wider uppercase mb-4">
          Common Online Scams in India
        </h4>
        <div className="chip-strip-wrap overflow-hidden w-full">
          <div className="chip-strip">
            {chips.map((chip, i) => (
              <div
                key={i}
                className="mx-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap bg-[#FFFDF9] border border-[#332A4D]/10 text-[#292433] shadow-xs flex items-center gap-1.5"
              >
                <span>⚠️</span>
                <span>{chip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. EMERGENCY 1930 ACTION STRIP ── */}
      <section className="py-6">
        <motion.div
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(255,107,95,0.2)',
              '0 0 0 14px rgba(255,107,95,0)',
              '0 0 0 0 rgba(255,107,95,0)',
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="rounded-3xl p-6 sm:p-8 bg-[#FFFDF9] border-2 border-[#FF6B5F]/40 flex flex-col sm:flex-row items-center gap-5 justify-between shadow-md"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#FF6B5F] text-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0 mx-auto sm:mx-0">
              🆘
            </div>
            <div>
              <p className="font-black text-[#211A32] text-lg sm:text-xl">
                Lost Money via UPI / Bank? Act Right Away.
              </p>
              <p className="text-[#706A78] text-xs sm:text-sm mt-0.5 leading-relaxed font-medium">
                Dial <strong className="text-[#211A32] font-black underline">1930</strong> (National Cyber Crime Helpline) immediately to freeze fraudulent transfers, then report on{' '}
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-bold text-[#332A4D] hover:text-[#FF6B5F] inline-flex items-center gap-1"
                >
                  cybercrime.gov.in <ExternalLink size={12} />
                </a>
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('complaint')}
              className="flex-1 sm:flex-none btn-coral px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm shadow-sm whitespace-nowrap cursor-pointer"
            >
              Draft 1930 Complaint
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
