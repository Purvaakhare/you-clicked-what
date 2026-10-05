import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const tileStyles = {
  protocol:  { bg: '#F8F6F1', border: '#DDD6F3', text: '#332A4D', label: 'Protocol' },
  subdomain: { bg: '#DDD6F3', border: '#C5BBEE', text: '#211A32', label: 'Subdomain' },
  domain:    { bg: '#FFFDF9', border: '#FF6B5F', text: '#211A32', label: 'Main Domain' },
  tld:       { bg: '#F8F6F1', border: '#DDD6F3', text: '#706A78', label: 'TLD Ending' },
  path:      { bg: '#FFFDF9', border: '#BFE8D2', text: '#2E8B68', label: 'Path' },
  query:     { bg: '#FFFDF9', border: '#F7D774', text: '#D99A28', label: 'Parameters' },
};

export default function UrlTiles({ parsed, isLookalike = false }) {
  const [activeTileIndex, setActiveTileIndex] = useState(0);

  if (!parsed) return null;

  const parts = [
    { key: 'protocol',  value: parsed.protocol },
    parsed.subdomain ? { key: 'subdomain', value: parsed.subdomain + '.' } : null,
    { key: 'domain',    value: parsed.domain, isTarget: isLookalike },
    { key: 'tld',       value: parsed.tld },
    parsed.path && parsed.path !== '/' ? { key: 'path', value: parsed.path } : null,
    parsed.query ? { key: 'query', value: parsed.query } : null,
  ].filter(Boolean);

  // Inspector moving across the tiles
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTileIndex(prev => (prev + 1) % parts.length);
    }, 850);
    return () => clearInterval(timer);
  }, [parts.length]);

  return (
    <div className="relative pt-7 pb-3">
      {/* Moving Inspector Badge */}
      <motion.div
        className="absolute top-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#332A4D] text-[#FFFDF9] text-[11px] font-bold shadow-xs pointer-events-none"
        animate={{
          left: `${(activeTileIndex / Math.max(parts.length - 1, 1)) * 72}%`,
        }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      >
        <Search size={12} className="text-[#BFE8D2]" />
        <span>Inspecting {parts[activeTileIndex]?.key}</span>
      </motion.div>

      {/* Tiles Breakdown */}
      <div className="flex flex-wrap gap-2.5 items-end">
        {parts.map((part, i) => {
          const cfg = tileStyles[part.key] || tileStyles.path;
          const isSuspectDomain = part.isTarget;
          const isCurrentInspection = activeTileIndex === i;

          return (
            <motion.div
              key={part.key}
              initial={{ y: 20, opacity: 0, scale: 0.85 }}
              animate={
                isSuspectDomain
                  ? {
                      y: 0,
                      opacity: 1,
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(217, 83, 79, 0)',
                        '0 0 0 4px rgba(217, 83, 79, 0.35)',
                        '0 0 0 0 rgba(217, 83, 79, 0)',
                      ],
                    }
                  : {
                      y: 0,
                      opacity: 1,
                      scale: isCurrentInspection ? 1.03 : 1,
                    }
              }
              transition={
                isSuspectDomain
                  ? {
                      delay: i * 0.08,
                      type: 'spring',
                      stiffness: 180,
                      boxShadow: { repeat: Infinity, duration: 1.6 },
                    }
                  : { delay: i * 0.08, type: 'spring', stiffness: 200, damping: 18 }
              }
              whileHover={{ y: -4, scale: 1.04 }}
              style={{
                backgroundColor: isSuspectDomain ? '#FFF5F5' : cfg.bg,
                border: isSuspectDomain ? '2px solid #D9534F' : `1.5px solid ${cfg.border}`,
                borderRadius: '16px',
                padding: '8px 14px',
                boxShadow: isCurrentInspection ? '0 4px 14px rgba(51, 42, 77, 0.08)' : '0 1px 4px rgba(51, 42, 77, 0.03)',
              }}
            >
              <div
                style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  color: isSuspectDomain ? '#D9534F' : cfg.text,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  marginBottom: 2,
                }}
              >
                {cfg.label}
              </div>
              <div
                className={isSuspectDomain ? 'font-black text-[#D9534F]' : ''}
                style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: isSuspectDomain ? '#D9534F' : cfg.text,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  wordBreak: 'break-all',
                }}
              >
                {part.value}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
