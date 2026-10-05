import React from 'react';
import { motion } from 'framer-motion';

/**
 * Editorial Semicircular Risk Gauge
 * Features:
 * - Mint -> Yellow -> Coral gradient arc
 * - Plum needle with pivot hub
 * - Modern typography with warm status badges
 */
export default function RiskGauge({ score, riskLevel }) {
  // Score 0 -> 100 maps to needle rotation: -180deg (left/safe) to 0deg (right/danger)
  const angle = -180 + (Math.min(Math.max(score, 0), 100) / 100) * 180;

  const config = {
    low: {
      color: '#2E8B68',
      bg: '#BFE8D2',
      border: '#2E8B68',
      label: 'SAFE',
      sub: 'No significant scam patterns detected',
    },
    medium: {
      color: '#D99A28',
      bg: '#F7D774',
      border: '#D99A28',
      label: 'SUSPICIOUS',
      sub: 'Multiple deceptive indicators found',
    },
    high: {
      color: '#D9534F',
      bg: '#FF6B5F',
      border: '#D9534F',
      label: 'HIGH RISK',
      sub: 'Severe scam characteristics identified',
    },
  };

  const current = config[riskLevel] || config.low;

  return (
    <div
      className="flex flex-col items-center p-6 rounded-3xl border border-[#332A4D]/10 bg-[#FFFDF9] transition-all duration-300 w-full max-w-[280px] shadow-sm"
    >
      <div className="relative mb-2">
        <svg width="220" height="120" viewBox="0 0 220 120">
          <defs>
            <linearGradient id="warmArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2E8B68" />
              <stop offset="50%" stopColor="#D99A28" />
              <stop offset="100%" stopColor="#D9534F" />
            </linearGradient>
          </defs>

          {/* Background track in warm neutral */}
          <path
            d="M 22 110 A 88 88 0 0 1 198 110"
            fill="none"
            stroke="#EDE8DF"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Shaded risk arc */}
          <path
            d="M 22 110 A 88 88 0 0 1 198 110"
            fill="none"
            stroke="url(#warmArcGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.95"
          />

          {/* Animated Needle */}
          <motion.g
            initial={{ rotate: -180 }}
            animate={{ rotate: angle }}
            transition={{ type: 'spring', stiffness: 50, damping: 13, delay: 0.25 }}
            style={{ transformOrigin: '110px 110px' }}
          >
            {/* Needle line */}
            <line
              x1="110"
              y1="110"
              x2="110"
              y2="36"
              stroke="#211A32"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Center Pivot Hub */}
            <circle cx="110" cy="110" r="9" fill="#211A32" />
            <circle cx="110" cy="110" r="4" fill="#FFFDF9" />
          </motion.g>

          {/* Base labels */}
          <text x="24" y="104" fontSize="10" fill="#9A94A2" fontWeight="700" textAnchor="middle">
            0%
          </text>
          <text x="110" y="20" fontSize="10" fill="#9A94A2" fontWeight="700" textAnchor="middle">
            50%
          </text>
          <text x="196" y="104" fontSize="10" fill="#9A94A2" fontWeight="700" textAnchor="middle">
            100%
          </text>
        </svg>
      </div>

      {/* Score and Labels */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-4xl font-extrabold tracking-tight text-[#211A32]"
        >
          {score}%
        </motion.div>

        <div
          className="mt-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase inline-block text-white"
          style={{
            backgroundColor: current.color,
          }}
        >
          {current.label}
        </div>

        <p className="text-[11px] font-semibold text-[#706A78] mt-1 max-w-[200px]">
          {current.sub}
        </p>
      </div>
    </div>
  );
}
