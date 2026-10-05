import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Orbiting 3D security elements around guardian
const FLOATING_SECURITY_OBJECTS = [
  { id: 'lock', icon: '🔒', label: 'Lock', radius: 155, angle: 30, speed: 12, size: 36, bg: '#F7D774', color: '#332A4D' },
  { id: 'msg', icon: '💬', label: 'SMS', radius: 170, angle: 100, speed: 10, size: 38, bg: '#DDD6F3', color: '#211A32' },
  { id: 'link', icon: '🔗', label: 'Link', radius: 150, angle: 170, speed: 14, size: 34, bg: '#BFE8D2', color: '#211A32' },
  { id: 'lens', icon: '🔍', label: 'Inspect', radius: 165, angle: 240, speed: 11, size: 36, bg: '#FFFDF9', color: '#332A4D' },
  { id: 'check', icon: '✓', label: 'Secure', radius: 145, angle: 310, speed: 13, size: 32, bg: '#BFE8D2', color: '#2E8B68' },
];

// Active threat cards that approach the guardian and get deflected
const THREAT_BUBBLES = [
  { id: 1, text: 'FREE GIFT!', bg: '#FF6B5F', color: '#FFFDF9', x: -145, y: -95, delay: 0 },
  { id: 2, text: 'URGENT OTP', bg: '#FF6B5F', color: '#FFFDF9', x: 145, y: -75, delay: 1.2 },
  { id: 3, text: 'YOU WON ₹10L', bg: '#F7D774', color: '#332A4D', x: -140, y: 75, delay: 2.4 },
  { id: 4, text: 'VERIFY KYC', bg: '#FF6B5F', color: '#FFFDF9', x: 140, y: 85, delay: 3.6 },
  { id: 5, text: 'CLICK NOW', bg: '#DDD6F3', color: '#211A32', x: 0, y: 135, delay: 4.8 },
];

export default function DigitalGuardian({ isMobile }) {
  const [blockedThreat, setBlockedThreat] = useState(null);
  const [pulseShield, setPulseShield] = useState(false);
  const [threatList, setThreatList] = useState(THREAT_BUBBLES);

  // Mouse-based 3D tilt physics (max ±8 degrees)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 22, mass: 0.9 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);
  const translateZ = useTransform(smoothMouseY, [-0.5, 0.5], [10, 25]);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Threat Block: pulse -> red X -> deflect -> fade
  const triggerDeflection = (threatId) => {
    setBlockedThreat(threatId);
    setPulseShield(true);
    setTimeout(() => setPulseShield(false), 700);

    // Respawn new threat bubble after brief delay
    setTimeout(() => {
      setBlockedThreat(null);
    }, 2400);
  };

  // Autonomous occasional threat encounter every 7 seconds
  useEffect(() => {
    const autoInterval = setInterval(() => {
      const available = THREAT_BUBBLES.filter((t) => t.id !== blockedThreat);
      const randomThreat = available[Math.floor(Math.random() * available.length)];
      if (randomThreat) {
        triggerDeflection(randomThreat.id);
      }
    }, 7000);
    return () => clearInterval(autoInterval);
  }, [blockedThreat]);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[420px] sm:max-w-[460px] h-[400px] sm:h-[440px] flex items-center justify-center mx-auto select-none"
      style={{ perspective: 1200 }}
    >
      {/* ── 1. ACTIVE 3D SCANNING RING ── */}
      {/* Communicates: 'System is actively scanning & protecting' */}
      <motion.div
        animate={{
          scale: [0.82, 1.25, 0.82],
          opacity: [0.55, 0.05, 0.55],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-[290px] h-[290px] sm:w-[330px] sm:h-[330px] rounded-full border-2 border-dashed border-[#BFE8D2] pointer-events-none -z-10"
      />

      <motion.div
        animate={{
          scale: [0.95, 1.15, 0.95],
          opacity: [0.4, 0.1, 0.4],
        }}
        transition={{
          duration: 5.4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.2,
        }}
        className="absolute w-[250px] h-[250px] sm:w-[280px] sm:h-[280px] rounded-full border border-[#DDD6F3] pointer-events-none -z-10"
      />

      {/* Dynamic floor shadow */}
      <motion.div
        animate={{
          scaleX: [1, 1.15, 1],
          opacity: [0.22, 0.12, 0.22],
        }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 w-48 h-8 bg-[#332A4D]/20 rounded-full blur-md"
      />

      {/* ── 2. CONTROLLED FLOATING SECURITY OBJECTS (LOCK, LINK, LENS, ETC.) ── */}
      {FLOATING_SECURITY_OBJECTS.map((obj) => (
        <motion.div
          key={obj.id}
          animate={{
            y: [0, -9, 0],
            rotate: [-4, 4, -4],
          }}
          transition={{
            duration: obj.speed / 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            transform: `translate(${Math.cos((obj.angle * Math.PI) / 180) * (isMobile ? obj.radius * 0.75 : obj.radius)}px, ${
              Math.sin((obj.angle * Math.PI) / 180) * (isMobile ? obj.radius * 0.75 : obj.radius) * 0.7
            }px) translateZ(30px)`,
            zIndex: 25,
          }}
          className="pointer-events-none"
        >
          <div
            style={{
              backgroundColor: obj.bg,
              color: obj.color,
              width: `${obj.size}px`,
              height: `${obj.size}px`,
            }}
            className="rounded-2xl flex items-center justify-center text-sm font-bold shadow-md border border-[#332A4D]/10"
          >
            <span>{obj.icon}</span>
          </div>
        </motion.div>
      ))}

      {/* ── 3. INTERACTIVE 3D SCAM BUBBLES ── */}
      {threatList.map((threat) => {
        const isBlocked = blockedThreat === threat.id;
        return (
          <motion.div
            key={threat.id}
            onClick={() => triggerDeflection(threat.id)}
            animate={
              isBlocked
                ? {
                    scale: [1, 1.25, 0],
                    opacity: [1, 1, 0],
                    rotate: [0, -16, 24],
                  }
                : {
                    y: [0, -8, 0],
                    rotate: [-2, 2, -2],
                  }
            }
            transition={
              isBlocked
                ? { duration: 0.55, ease: 'easeOut' }
                : { duration: 3.8 + threat.delay * 0.4, repeat: Infinity, ease: 'easeInOut' }
            }
            style={{
              position: 'absolute',
              transform: `translate(${threat.x * (isMobile ? 0.8 : 1)}px, ${threat.y * (isMobile ? 0.8 : 1)}px) translateZ(40px)`,
              zIndex: 35,
              cursor: 'pointer',
            }}
          >
            {isBlocked ? (
              <div className="w-8 h-8 rounded-full bg-[#FF6B5F] text-white flex items-center justify-center font-black text-xs shadow-lg border border-white">
                ✕
              </div>
            ) : (
              <div
                style={{ backgroundColor: threat.bg, color: threat.color }}
                className="px-3.5 py-1.5 rounded-full text-xs font-black tracking-tight shadow-md border border-black/5 hover:scale-108 transition-transform whitespace-nowrap flex items-center gap-1.5"
              >
                <span className="text-xs">⚠️</span>
                <span>{threat.text}</span>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* ── 4. MAIN HERO 3D SECURITY GUARDIAN ── */}
      <motion.div
        animate={{
          y: [0, -12, 0],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          translateZ: isMobile ? 0 : translateZ,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-20 cursor-grab active:cursor-grabbing"
      >
        <svg width="230" height="250" viewBox="0 0 220 240" fill="none" className="drop-shadow-2xl">
          {/* Main Rounded Shield in Deep Plum */}
          <path
            d="M110 14 C175 14 200 48 200 115 C200 182 145 220 110 234 C75 220 20 182 20 115 C20 48 45 14 110 14 Z"
            fill="#332A4D"
          />

          {/* Inner Cream Contour Bevel */}
          <path
            d="M110 26 C165 26 186 54 186 114 C186 172 140 206 110 219 C80 206 34 172 34 114 C34 54 55 26 110 26 Z"
            fill="#FFFDF9"
          />

          {/* Guardian Belly in Warm Soft Tint */}
          <path
            d="M110 38 C155 38 172 62 172 114 C172 164 134 194 110 205 C86 194 48 164 48 114 C48 62 65 38 110 38 Z"
            fill="#F8F6F1"
          />

          {/* Expressive Friendly Guardian Eyes */}
          <circle cx="88" cy="100" r="10" fill="#211A32" />
          <circle cx="85" cy="97" r="3.5" fill="#FFFDF9" />

          <circle cx="132" cy="100" r="10" fill="#211A32" />
          <circle cx="129" cy="97" r="3.5" fill="#FFFDF9" />

          {/* Cheeks in Accent Coral */}
          <ellipse cx="76" cy="112" rx="7" ry="4.5" fill="#FF6B5F" opacity="0.6" />
          <ellipse cx="144" cy="112" rx="7" ry="4.5" fill="#FF6B5F" opacity="0.6" />

          {/* Gentle Smile */}
          <path
            d="M102 116 Q110 124 118 116"
            stroke="#211A32"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Chest Lock Emblem in Warm Yellow */}
          <rect x="94" y="146" width="32" height="26" rx="8" fill="#F7D774" />
          <path
            d="M101 146 V137 C101 132 105 128 110 128 C115 128 119 132 119 137 V146"
            stroke="#332A4D"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Keyhole */}
          <circle cx="110" cy="157" r="3" fill="#332A4D" />
          <path d="M110 159 V165" stroke="#332A4D" strokeWidth="2.5" strokeLinecap="round" />

          {/* Sparkle emblem on forehead */}
          <path
            d="M110 50 L112 56 L118 58 L112 60 L110 66 L108 60 L102 58 L108 56 Z"
            fill="#FF6B5F"
          />
        </svg>

        {/* Pulse barrier ring when a threat is intercepted */}
        {pulseShield && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0.9 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-0 border-4 border-[#FF6B5F] rounded-full pointer-events-none"
          />
        )}
      </motion.div>
    </div>
  );
}
