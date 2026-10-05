import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Polished PageTransition wrapper:
 * - Opacity 0 -> 1
 * - translateY 14px -> 0
 * - scale 0.985 -> 1
 * - subtle rotateX tilt
 * - smooth duration 320ms
 */
const variants = {
  initial: {
    opacity: 0,
    y: 14,
    scale: 0.988,
    rotateX: 2,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.992,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function PageTransition({ children, pageKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          transformOrigin: 'top center',
          perspective: 1200,
          minHeight: '100%',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
