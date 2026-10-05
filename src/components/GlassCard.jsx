import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Premium GlassCard component.
 * Features:
 * - Soft layered shadow with subtle border
 * - 24px rounded corners
 * - Optional subtle 3D cursor tilt (tilt3d)
 * - Micro-interaction hover lift & scale
 */
export default function GlassCard({
  children,
  className = '',
  style = {},
  onClick,
  tilt3d = false,
  interactive = false,
}) {
  const ref = useRef(null);

  // Smooth mouse-follow spring physics
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [4.5, -4.5]), { stiffness: 220, damping: 26 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-4.5, 4.5]), { stiffness: 220, damping: 26 });

  const handleMouseMove = (e) => {
    if (!tilt3d || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    if (!tilt3d) return;
    rawX.set(0);
    rawY.set(0);
  };

  const motionStyle = tilt3d
    ? { rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 950 }
    : {};

  return (
    <motion.div
      ref={ref}
      className={`glass-card ${interactive ? 'glass-card-interactive cursor-pointer' : ''} ${className}`}
      style={{ ...style, ...motionStyle }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
