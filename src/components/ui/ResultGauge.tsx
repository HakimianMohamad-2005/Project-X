import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { useLocaleFormat } from './format';

/**
 * Semicircle gauge from "instinct" (0) to "system" (100).
 * The needle sweeps to `value` and the centre counter follows it.
 */
export const ResultGauge: React.FC<{ value: number; instinctLabel: string; systemLabel: string; centerLabel?: string }> = ({
  value,
  instinctLabel,
  systemLabel,
  centerLabel,
}) => {
  const { pct } = useLocaleFormat();
  const v = useMotionValue(0);
  const rotate = useTransform(v, [0, 100], [-90, 90]);
  const text = useTransform(v, (x) => pct(Math.round(x)));

  useEffect(() => {
    const c = animate(v, value, { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 });
    return () => c.stop();
  }, [value, v]);

  const ticks = Array.from({ length: 41 }, (_, i) => -90 + i * 4.5);

  return (
    <div className="relative mx-auto w-full max-w-sm" dir="ltr">
      <svg viewBox="-160 -150 320 185" className="w-full" aria-hidden="true">
        <defs>
          <linearGradient id="og-result-gauge" x1="0" x2="1">
            <stop offset="0%" stopColor="#E05A47" />
            <stop offset="50%" stopColor="#D9894A" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        <path d="M -130 0 A 130 130 0 0 1 130 0" fill="none" stroke="var(--og-line)" strokeWidth="18" strokeLinecap="round" />
        <path d="M -130 0 A 130 130 0 0 1 130 0" fill="none" stroke="url(#og-result-gauge)" strokeWidth="6" strokeLinecap="round" />
        {ticks.map((deg, i) => {
          const a = ((deg - 90) * Math.PI) / 180;
          const long = i % 5 === 0;
          return (
            <line
              key={i}
              x1={Math.cos(a) * (long ? 100 : 106)}
              y1={Math.sin(a) * (long ? 100 : 106)}
              x2={Math.cos(a) * 114}
              y2={Math.sin(a) * 114}
              stroke="var(--og-ink-3)"
              strokeWidth={long ? 1.6 : 0.8}
            />
          );
        })}
        <motion.g style={{ rotate }}>
          <circle r="122" fill="none" />
          <line x1="0" y1="10" x2="0" y2="-112" stroke="#D9894A" strokeWidth="3.5" strokeLinecap="round" />
          <circle cy="-112" r="4.5" fill="#FFD3A1" />
        </motion.g>
        <circle r="12" fill="var(--og-surface)" stroke="#D9894A" strokeWidth="2.5" />
        <text x="-130" y="26" textAnchor="middle" fontSize="11" fontWeight="800" fill="#E05A47">
          {instinctLabel}
        </text>
        <text x="130" y="26" textAnchor="middle" fontSize="11" fontWeight="800" fill="#10B981">
          {systemLabel}
        </text>
      </svg>
      <div className="-mt-1 flex flex-col items-center">
        <motion.span className="text-4xl sm:text-5xl font-black text-ink tracking-tight">{text}</motion.span>
        {centerLabel && <span className="text-[11px] font-bold text-ink-3">{centerLabel}</span>}
      </div>
    </div>
  );
};
