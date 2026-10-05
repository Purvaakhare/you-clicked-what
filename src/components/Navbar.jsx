import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home',          label: 'Home' },
  { id: 'check-message', label: 'Check Message' },
  { id: 'check-link',    label: 'Check Link' },
  { id: 'clicked-it',   label: 'I Clicked It!' },
  { id: 'complaint',    label: 'Complaint Helper' },
];

export default function Navbar({ activePage, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* ── STICKY FLOATING PILL NAVBAR (DESKTOP + TABLET) ── */}
      <header className="sticky top-4 z-50 px-4 sm:px-6 max-w-5xl mx-auto w-full transition-all">
        <div className="bg-[#FFFDF9]/90 backdrop-blur-xl border border-[#332A4D]/10 rounded-full px-4 sm:px-5 py-2.5 shadow-[0_4px_24px_rgba(51,42,77,0.06)] flex items-center justify-between gap-4">
          
          {/* Logo / Brand Name */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
          >
            <motion.div
              whileHover={{ rotate: [-6, 6, 0], scale: 1.08 }}
              className="w-9 h-9 rounded-full bg-[#332A4D] flex items-center justify-center text-[#FFFDF9] shadow-sm"
            >
              <Shield size={18} className="text-[#BFE8D2]" />
            </motion.div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-[#211A32]">
                You Clicked
              </span>
              <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF6B5F] text-white tracking-wide shadow-2xs">
                WHAT?!
              </span>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F8F6F1] p-1 rounded-full border border-[#332A4D]/5">
            {NAV_ITEMS.map((item) => {
              const active = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer select-none ${
                    active ? 'text-[#FFFDF9]' : 'text-[#706A78] hover:text-[#211A32]'
                  }`}
                >
                  {/* Sliding Deep Plum Pill Background */}
                  {active && (
                    <motion.div
                      layoutId="navPill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 bg-[#332A4D] rounded-full shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: 1930 Quick SOS */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onNavigate('complaint')}
              className="text-xs font-extrabold text-[#332A4D] bg-[#F7D774]/60 hover:bg-[#F7D774] border border-[#D99A28]/30 px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1"
            >
              <span>SOS 1930</span>
              <ArrowUpRight size={13} className="text-[#332A4D]" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#332A4D] hover:bg-[#F8F6F1] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── MOBILE MENU DROPDOWN ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-20 left-4 right-4 z-50 bg-[#FFFDF9] border border-[#332A4D]/10 rounded-3xl p-5 shadow-2xl space-y-2"
          >
            <div className="text-[11px] font-black uppercase text-[#9A94A2] tracking-wider mb-2 px-2">
              Menu Navigation
            </div>
            {NAV_ITEMS.map((item) => {
              const active = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-left transition-all ${
                    active
                      ? 'bg-[#332A4D] text-[#FFFDF9]'
                      : 'text-[#292433] hover:bg-[#F8F6F1]'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && <span className="text-xs text-[#BFE8D2] font-black">Active</span>}
                </button>
              );
            })}

            <div className="pt-3 border-t border-[#332A4D]/10">
              <button
                onClick={() => {
                  onNavigate('complaint');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#FF6B5F] text-white py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>National Helpline: 1930</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
