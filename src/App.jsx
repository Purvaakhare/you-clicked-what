import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import BackgroundParticles from './components/BackgroundParticles';
import Home from './pages/Home';
import CheckMessage from './pages/CheckMessage';
import CheckLink from './pages/CheckLink';
import ClickedIt from './pages/ClickedIt';
import ComplaintHelper from './pages/ComplaintHelper';

// Editorial Layered Background with ambient blur shapes
function EditorialBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Base warm cream tint */}
      <div className="absolute inset-0 bg-[#F8F6F1]" />

      {/* Subtle editorial dot texture */}
      <div className="absolute inset-0 editorial-pattern opacity-40" />

      {/* Ambient soft shapes */}
      <div className="absolute -top-[12vw] -right-[8vw] w-[46vw] h-[46vw] rounded-full bg-[#DDD6F3]/30 blur-[120px]" />
      <div className="absolute -bottom-[10vw] -left-[6vw] w-[38vw] h-[38vw] rounded-full bg-[#FF6B5F]/10 blur-[130px]" />
      <div className="absolute top-[35%] right-[10%] w-[32vw] h-[32vw] rounded-full bg-[#BFE8D2]/35 blur-[100px]" />

      {/* 3D Floating Particles */}
      <BackgroundParticles />
    </div>
  );
}

const PAGES = {
  home: Home,
  'check-message': CheckMessage,
  'check-link': CheckLink,
  'clicked-it': ClickedIt,
  complaint: ComplaintHelper,
};

export default function App() {
  const [activePage, setActivePage] = useState('home');

  const navigate = (page) => {
    if (PAGES[page]) {
      setActivePage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const PageComponent = PAGES[activePage] || Home;

  return (
    <div className="relative min-h-screen text-[#292433] bg-[#F8F6F1] antialiased selection:bg-[#FF6B5F] selection:text-white flex flex-col font-sans">
      {/* Editorial Layered Background + Particles */}
      <EditorialBackground />

      {/* Sticky Floating Pill Navigation Bar */}
      <Navbar activePage={activePage} onNavigate={navigate} />

      {/* Main Content View with 3D Depth Page Transition */}
      <main className="relative z-10 flex-1 w-full pt-6">
        <PageTransition pageKey={activePage}>
          <PageComponent onNavigate={navigate} />
        </PageTransition>
      </main>

      {/* Global Minimal Footer */}
      <footer className="relative z-10 py-8 px-4 text-center border-t border-[#332A4D]/5 text-xs text-[#706A78] font-medium bg-[#FFFDF9]/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#332A4D]">You Clicked WHAT?!</span>
            <span>&bull;</span>
            <span>Independent Cyber Safety Helper</span>
          </div>
          <div>Never share OTPs, UPI PINs, or passwords with anyone. 🔒</div>
        </div>
      </footer>
    </div>
  );
}
