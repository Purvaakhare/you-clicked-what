import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Reusable 3D Tilt Card component with depth layering and dynamic spotlight sheen.
 * Maximum rotation kept between ±6° to ±8° for a refined, tactile feel.
 * Preserves the Cream + Plum + Coral + Mint design system.
 */
export default function Tilt3DCard({
  children,
  className = '',
  style = {},
  onClick,
  maxTilt = 7,
  depth = 18,
}) {
  const cardRef = useRef(null);

  // Raw relative cursor position (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for natural tactile reaction
  const springConfig = { stiffness: 240, damping: 25, mass: 0.8 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // 3D rotations and spotlight position
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const spotlightX = useTransform(smoothX, [-0.5, 0.5], ['0%', '100%']);
  const spotlightY = useTransform(smoothY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1100,
        ...style,
      }}
      whileHover={{ scale: 1.015, y: -4 }}
      transition={{ duration: 0.2 }}
      className={`relative surface-card rounded-[24px] transition-shadow duration-300 hover:shadow-[0_16px_36px_rgba(51,42,77,0.08)] ${className}`}
    >
      {/* Subtle dynamic sheen that moves with cursor */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-300 hover:opacity-100 z-10"
        style={{
          background: useTransform(
            [spotlightX, spotlightY],
            ([sx, sy]) =>
              `radial-gradient(circle at ${sx} ${sy}, rgba(255, 253, 249, 0.45) 0%, transparent 65%)`
          ),
        }}
      />

      {/* Card Content with 3D child depth */}
      <div style={{ transform: `translateZ(${depth}px)`, transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
}
