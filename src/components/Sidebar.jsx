import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, MessageSquare, Link2, MousePointerClick, FileText, ChevronLeft, ChevronRight, Menu, X, ShieldAlert, Sparkles, Shield
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home',          label: 'Home',             icon: Home,              badge: 'Overview' },
  { id: 'check-message', label: 'Check Message',     icon: MessageSquare,    badge: 'SMS / WA' },
  { id: 'check-link',    label: 'Check Link',         icon: Link2,            badge: 'URL Engine' },
  { id: 'clicked-it',   label: 'I Clicked It!',      icon: MousePointerClick, badge: 'Lockdown' },
  { id: 'complaint',    label: 'Complaint Helper',   icon: FileText,         badge: '1930 / FIR' },
];

export default function Sidebar({
  activePage,
  onNavigate,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen
}) {
  const navRef = useRef(null);
  const itemRefs = useRef({});
  const [pillStyle, setPillStyle] = useState({ top: 0, height: 48 });

  useLayoutEffect(() => {
    const activeEl = itemRefs.current[activePage];
    if (activeEl && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const elRect  = activeEl.getBoundingClientRect();
      setPillStyle({
        top:    elRect.top - navRect.top,
        height: elRect.height,
      });
    }
  }, [activePage, isCollapsed]);

  return (
    <>
      {/* ── DESKTOP FLOATING GLASS CONTROL PANEL ── */}
      <motion.aside
        animate={{ width: isCollapsed ? 84 : 260 }}
        transition={{ type: 'spring', stiffness: 350, damping: 32 }}
        className="hidden md:flex flex-col fixed top-4 bottom-4 left-4 z-40 bg-white/80 backdrop-blur-2xl border border-white/90 rounded-[28px] shadow-[0_12px_40px_rgba(30,58,138,0.08)] overflow-hidden"
      >
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100/80 min-h-[72px]">
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none overflow-hidden"
          >
            <motion.div
              whileHover={{ rotate: [-4, 4, 0], scale: 1.08 }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#3B5BDB] shadow-md shadow-blue-800/25"
            >
              <Shield size={20} className="text-white" />
            </motion.div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-slate-900 tracking-tight">You Clicked</span>
                  <span className="text-[10px] bg-red-100 text-red-600 font-extrabold px-1.5 py-0.2 rounded-full border border-red-200">
                    WHAT?!
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-400">Cybersecurity Assistant</p>
              </motion.div>
            )}
          </div>

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
            className="w-8 h-8 rounded-xl bg-slate-100/80 hover:bg-blue-50 text-slate-600 hover:text-blue-700 flex items-center justify-center transition-all cursor-pointer border border-slate-200/50 flex-shrink-0"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Live Protection Status Indicator */}
        {!isCollapsed && (
          <div className="px-3.5 pt-3">
            <div className="px-3 py-2 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-bold text-slate-800">Browser Guard Active</span>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-blue-800 shadow-2xs border border-blue-200/60">
                Local
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items with Sliding Pill */}
        <nav ref={navRef} className="flex-1 px-3 py-4 space-y-1 relative overflow-y-auto no-scrollbar">
          {/* Animated sliding background pill */}
          <motion.div
            className="absolute left-3 right-3 rounded-2xl pointer-events-none z-0 bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B5BDB] shadow-lg shadow-blue-800/25 border border-white/20"
            animate={{ top: pillStyle.top, height: pillStyle.height }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />

          {NAV_ITEMS.map(item => {
            const active = activePage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                ref={el => { itemRefs.current[item.id] = el; }}
                onClick={() => onNavigate(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`relative z-10 w-full flex items-center rounded-2xl text-sm font-bold transition-colors cursor-pointer group ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-3'
                } ${active ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`p-1.5 rounded-xl transition-all ${
                      active
                        ? 'bg-white/20 text-white shadow-xs'
                        : 'bg-slate-100/70 text-slate-600 group-hover:bg-blue-100/70 group-hover:text-blue-800'
                    }`}
                  >
                    <Icon size={18} />
                  </motion.div>
                  {!isCollapsed && <span className="tracking-tight text-[13.5px]">{item.label}</span>}
                </div>

                {!isCollapsed && (
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide transition-colors ${
                      active
                        ? 'bg-white/20 text-blue-50'
                        : 'bg-slate-100 text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Helpline Quick Card */}
        {!isCollapsed ? (
          <div className="p-3.5 mx-3 mb-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🚨</span>
                <p className="text-xs font-black text-amber-950">Helpline: 1930</p>
              </div>
              <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded-md">
                24x7
              </span>
            </div>
            <p className="text-[11px] text-amber-900/80 font-medium leading-relaxed">
              Call immediately if unauthorized UPI transfers occur.
            </p>
          </div>
        ) : (
          <div className="p-2 mb-3 flex justify-center">
            <button
              onClick={() => onNavigate('complaint')}
              title="National Cyber Crime Helpline: 1930"
              className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-xs border border-amber-300 hover:scale-105 transition-transform"
            >
              1930
            </button>
          </div>
        )}

        {/* Footer lock note */}
        <div className="p-3 border-t border-slate-100/80 bg-slate-50/40 text-center">
          {!isCollapsed ? (
            <p className="text-[11px] text-slate-400 font-medium">
              Zero storage &bull; 100% Client-side 🔒
            </p>
          ) : (
            <span className="text-xs">🔒</span>
          )}
        </div>
      </motion.aside>

      {/* ── MOBILE TOP BAR & DRAWER ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-2xl border-b border-slate-200/70 px-4 py-3 flex items-center justify-between shadow-xs">
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#3B5BDB] flex items-center justify-center text-white shadow-xs">
            <Shield size={16} />
          </div>
          <div>
            <span className="font-black text-slate-900 text-sm tracking-tight">You Clicked </span>
            <span className="text-xs font-black text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">WHAT?!</span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-[290px] bg-white z-50 p-5 flex flex-col shadow-2xl rounded-r-[28px]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#3B5BDB] flex items-center justify-center text-white">
                    <Shield size={16} />
                  </div>
                  <span className="font-black text-base text-slate-900">You Clicked WHAT?!</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="my-4 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/60">
                <p className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-blue-600" /> Free Cyber Shield
                </p>
                <p className="text-[11px] text-blue-700 mt-1">Smart security tools for Indian students.</p>
              </div>

              <nav className="flex-1 space-y-1.5">
                {NAV_ITEMS.map(item => {
                  const active = activePage === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                        active
                          ? 'bg-gradient-to-r from-[#1E3A8A] to-[#3B5BDB] text-white shadow-md shadow-blue-900/20'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <p className="text-xs font-black text-amber-900">Lost Money? Call 1930</p>
                <p className="text-[11px] text-amber-700 mt-0.5">National Cyber Crime Helpline is free &amp; 24x7.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── FLOATING MOBILE BOTTOM NAVIGATION BAR ── */}
      <div className="md:hidden fixed bottom-3 left-4 right-4 z-40">
        <nav className="bg-white/90 backdrop-blur-2xl border border-white/95 rounded-[24px] flex items-center justify-around py-1.5 px-1 shadow-[0_10px_30px_rgba(15,23,42,0.1)]">
          {NAV_ITEMS.map(item => {
            const active = activePage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex-1 flex flex-col items-center gap-1 py-1 relative text-center"
              >
                <motion.div
                  animate={active ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
                  className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                    active
                      ? 'bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400'
                  }`}
                >
                  <Icon size={16} />
                </motion.div>
                <span
                  className={`text-[9.5px] font-black tracking-tight ${
                    active ? 'text-blue-900 font-extrabold' : 'text-slate-400'
                  }`}
                >
                  {item.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
