import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Low-opacity subtle background particles (dots, small locks, shields, pluses)
const PARTICLES = [
  { id: 1, type: 'plus', x: '12%', y: '18%', size: 14, speed: 6 },
  { id: 2, type: 'dot', x: '24%', y: '42%', size: 6, speed: 7 },
  { id: 3, type: 'shield', x: '85%', y: '22%', size: 16, speed: 8 },
  { id: 4, type: 'lock', x: '78%', y: '65%', size: 15, speed: 7.5 },
  { id: 5, type: 'dot', x: '45%', y: '82%', size: 7, speed: 6.5 },
  { id: 6, type: 'plus', x: '92%', y: '48%', size: 12, speed: 9 },
  { id: 7, type: 'shield', x: '8%', y: '75%', size: 14, speed: 7 },
  { id: 8, type: 'dot', x: '62%', y: '14%', size: 5, speed: 8.5 },
];

export default function BackgroundParticles() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            opacity: 0.22,
          }}
          animate={{
            y: [0, -14, 0],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: p.speed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {p.type === 'plus' && (
            <span style={{ fontSize: `${p.size}px`, color: '#FF6B5F', fontWeight: 900 }}>+</span>
          )}
          {p.type === 'dot' && (
            <div
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: '#332A4D',
                borderRadius: '50%',
              }}
            />
          )}
          {p.type === 'shield' && (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="#2E8B68" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          )}
          {p.type === 'lock' && (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="#7567C7" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}
