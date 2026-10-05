import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const BUBBLES = [
  { text: 'KYC expired!', angle: 0, radius: 145, speed: 7.5, depthWeight: 0.8 },
  { text: 'You won ₹10 lakh', angle: 60, radius: 160, speed: 9.5, depthWeight: 1.1 },
  { text: 'Click this link', angle: 120, radius: 135, speed: 6.5, depthWeight: 0.7 },
  { text: 'Share your OTP', angle: 180, radius: 165, speed: 10.5, depthWeight: 1.2 },
  { text: 'Electricity bill unpaid', angle: 240, radius: 150, speed: 8.5, depthWeight: 0.9 },
  { text: 'Free gift! Claim now', angle: 300, radius: 155, speed: 8.0, depthWeight: 1.0 },
];

function OrbitBubble({ text, angle, radius, speed, onBlock, isMobile }) {
  const [blocked, setBlocked] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(angle);
  const rafRef = useRef(null);
  const startRef = useRef(Date.now());
  const r = isMobile ? radius * 0.62 : radius;

  useEffect(() => {
    const animate = () => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const newAngle = angle + elapsed * (360 / speed);
      setCurrentAngle(newAngle);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [angle, speed]);

  const rad = (currentAngle * Math.PI) / 180;
  const x = Math.cos(rad) * r;
  const y = Math.sin(rad) * r * 0.44;
  const depth = Math.sin(rad); // -1 (back) to +1 (front)
  const scale = isMobile ? 0.78 + depth * 0.1 : 0.88 + depth * 0.14;
  const zIndex = Math.round(depth * 10 + 20);

  // Auto deflection trigger when bubble gets close in front
  const distFromCenter = Math.sqrt(x * x + y * y);
  const blockThreshold = isMobile ? 46 : 68;

  useEffect(() => {
    if (depth > 0.45 && distFromCenter < blockThreshold && !blocked) {
      setBlocked(true);
      onBlock && onBlock();
      const timer = setTimeout(() => setBlocked(false), 2400);
      return () => clearTimeout(timer);
    }
  }, [distFromCenter, depth, blocked, blockThreshold]);

  const handleClick = () => {
    if (blocked) return;
    setBlocked(true);
    onBlock && onBlock();
    setTimeout(() => setBlocked(false), 2400);
  };

  return (
    <motion.div
      onClick={handleClick}
      animate={
        blocked
          ? { scale: [1, 1.3, 0], opacity: [1, 1, 0], rotate: [0, -14, 20] }
          : { scale, opacity: depth < -0.3 ? 0.55 : 1 }
      }
      transition={blocked ? { duration: 0.55, ease: 'easeOut' } : { duration: 0.05 }}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        zIndex: blocked ? 45 : zIndex,
        cursor: 'pointer',
      }}
    >
      {blocked ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 1] }}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 border border-red-300 shadow-lg text-sm font-black"
        >
          ✕
        </motion.div>
      ) : (
        <div
          className="transition-all duration-200 hover:scale-105 select-none"
          style={{
            padding: isMobile ? '5px 11px' : '6px 14px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(239, 68, 68, 0.35)',
            boxShadow: '0 4px 16px rgba(220, 38, 38, 0.12), 0 1px 3px rgba(15, 23, 42, 0.05)',
            fontSize: isMobile ? '10px' : '11.5px',
            fontWeight: 700,
            color: '#B91C1C',
            whiteSpace: 'nowrap',
          }}
        >
          <span className="mr-1 text-red-500">⚠️</span>
          {text}
        </div>
      )}
    </motion.div>
  );
}

export default function Shield3D({ isMobile }) {
  const containerRef = useRef(null);
  const [pulse, setPulse] = useState(false);

  // Parallax spring mouse tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 24 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 180, damping: 24 });

  const handleMouseMove = (e) => {
    if (!containerRef.current || isMobile) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleBlock = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 850);
  };

  const shieldSize = isMobile ? 124 : 170;
  const displayBubbles = isMobile ? BUBBLES.slice(0, 4) : BUBBLES;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: isMobile ? 280 : 400,
        height: isMobile ? 280 : 400,
        margin: '0 auto',
      }}
    >
      {/* Dynamic floor shadow ellipse that breathes with elevation */}
      <motion.div
        animate={{
          scaleX: [1, 1.15, 1],
          scaleY: [1, 1.1, 1],
          opacity: [0.18, 0.09, 0.18],
        }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: isMobile ? 12 : 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: shieldSize * 1.35,
          height: shieldSize * 0.22,
          background: 'radial-gradient(ellipse, rgba(30, 58, 138, 0.35) 0%, transparent 72%)',
          borderRadius: '50%',
          filter: 'blur(8px)',
        }}
      />

      {/* Orbiting scam bubbles */}
      {displayBubbles.map((b, i) => (
        <OrbitBubble key={i} {...b} onBlock={handleBlock} isMobile={isMobile} />
      ))}

      {/* 3D Shield floating & tilting */}
      <motion.div
        animate={{
          y: isMobile ? [0, -9, 0] : [0, -14, 0],
          rotateZ: isMobile ? [-1.2, 1.2, -1.2] : [-2, 2, -2],
        }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          perspective: 1000,
          zIndex: 25,
        }}
      >
        <motion.div
          style={{
            rotateX: isMobile ? 0 : rotateX,
            rotateY: isMobile ? 0 : rotateY,
            transformStyle: 'preserve-3d',
          }}
          animate={
            isMobile
              ? { rotateX: [0, 4, 0], rotateY: [4, -4, 4] }
              : undefined
          }
          transition={
            isMobile
              ? { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
              : undefined
          }
        >
          <svg
            width={shieldSize}
            height={shieldSize * 1.2}
            viewBox="0 0 100 120"
            style={{
              filter: 'drop-shadow(0 18px 36px rgba(30, 58, 138, 0.38)) drop-shadow(0 2px 8px rgba(15, 23, 42, 0.1))',
            }}
          >
            <defs>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="60%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#3B5BDB" />
              </linearGradient>
              <linearGradient id="shieldSpecular" x1="0%" y1="0%" x2="45%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </linearGradient>
            </defs>

            {/* Shield Body */}
            <path
              d="M50 6 L90 22 L90 55 Q90 90 50 114 Q10 90 10 55 L10 22 Z"
              fill="url(#shieldGrad)"
            />

            {/* Specular highlights */}
            <path
              d="M50 6 L90 22 L90 55 Q90 90 50 114 Q10 90 10 55 L10 22 Z"
              fill="url(#shieldSpecular)"
              opacity="0.75"
            />

            {/* Inner bevel border */}
            <path
              d="M50 14 L84 28 L84 55 Q84 84 50 106 Q16 84 16 55 L16 28 Z"
              fill="none"
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth="1.5"
            />

            {/* Padlock Shackle */}
            <path
              d="M42 58 L42 50 Q42 41 50 41 Q58 41 58 50 L58 58"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity="0.98"
            />

            {/* Padlock Body */}
            <rect
              x="37"
              y="56"
              width="26"
              height="22"
              rx="4"
              fill="#FFFFFF"
              opacity="0.98"
              style={{ filter: 'drop-shadow(0 2px 6px rgba(15, 23, 42, 0.25))' }}
            />

            {/* Keyhole */}
            <circle cx="50" cy="65" r="3.2" fill="#1E3A8A" />
            <rect x="48.5" y="66" width="3" height="5.5" rx="1" fill="#1E3A8A" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Pulse ring when blocking a bubble */}
      {pulse && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0.85 }}
          animate={{ scale: 2.1, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: shieldSize,
            height: shieldSize * 1.2,
            marginLeft: -shieldSize / 2,
            marginTop: -(shieldSize * 1.2) / 2,
            borderRadius: '50%',
            border: '3px solid rgba(59, 91, 219, 0.75)',
            boxShadow: '0 0 24px rgba(59, 91, 219, 0.45)',
            pointerEvents: 'none',
            zIndex: 18,
          }}
        />
      )}
    </div>
  );
}
