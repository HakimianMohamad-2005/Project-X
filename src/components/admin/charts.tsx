import React, { useEffect, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { ANSWER_HEX, AnswerMap, FA_QUESTIONS, fa, scoreHex } from './assessmentData';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Count-up number in Persian digits. */
export const CountUp: React.FC<{ value: number; suffix?: string; duration?: number; className?: string }> = ({
  value,
  suffix = '',
  duration = 1.4,
  className = '',
}) => {
  const mv = useMotionValue(0);
  const [text, setText] = useState(fa(0));
  useEffect(() => {
    const c = animate(mv, value, { duration, ease: EASE, onUpdate: (v) => setText(fa(Math.round(v).toLocaleString('en-US'))) });
    return () => c.stop();
  }, [value, duration, mv]);
  return (
    <span className={`tabular-nums ${className}`}>
      {text}
      {suffix}
    </span>
  );
};

/** Circular score ring; colour follows the score unless `color` is given. */
export const ScoreRing: React.FC<{
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  className?: string;
  textClass?: string;
}> = ({ value, size = 56, stroke = 5, color, label, className = '', textClass = 'text-sm' }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const hex = color || scoreHex(value);
  return (
    <div className={`relative inline-flex shrink-0 items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--og-line-strong)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={hex}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - Math.max(0, Math.min(100, value)) / 100) }}
          transition={{ duration: 1.3, ease: EASE }}
          style={{ filter: `drop-shadow(0 0 6px ${hex}66)` }}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className={`font-black tabular-nums ${textClass}`} style={{ color: hex }}>
          {fa(value)}
        </span>
        {label && <span className="mt-1 text-[9px] font-bold text-ink-3">{label}</span>}
      </span>
    </div>
  );
};

/**
 * The answer "genome": one cell per question, coloured by how instinctive the answer was.
 * Reads right-to-left like the rest of the panel.
 */
export const AnswerStrip: React.FC<{
  answers: AnswerMap;
  size?: 'xs' | 'md';
  onPick?: (questionId: number) => void;
  activeId?: number | null;
}> = ({ answers, size = 'xs', onPick, activeId }) => {
  const cell = size === 'xs' ? 'h-4 w-[5px] rounded-[2px]' : 'h-9 flex-1 min-w-[10px] rounded-md';
  return (
    <div className={`flex items-end ${size === 'xs' ? 'gap-[2px]' : 'gap-1'}`}>
      {FA_QUESTIONS.map((q, i) => {
        const ans = answers[String(q.id)];
        const hex = ans ? ANSWER_HEX[Math.max(0, Math.min(3, ans.score))] : undefined;
        const common = {
          className: `${cell} ${onPick ? 'cursor-pointer transition-transform hover:-translate-y-0.5' : ''} ${
            activeId === q.id ? 'ring-2 ring-ink ring-offset-2 ring-offset-surface' : ''
          }`,
          style: { background: hex || 'var(--og-line-strong)', opacity: hex ? 1 : 0.6 },
          title: `سؤال ${fa(q.id)}: ${q.title}${ans ? ` — امتیاز ${fa(ans.score)}` : ''}`,
        };
        return onPick ? (
          <motion.button
            key={q.id}
            type="button"
            {...common}
            onClick={() => onPick(q.id)}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.15 + i * 0.02, duration: 0.4, ease: EASE }}
            aria-label={common.title}
          />
        ) : (
          <span key={q.id} {...common} />
        );
      })}
    </div>
  );
};

/** Daily bar chart for the last N days. */
export const DailyBars: React.FC<{ data: { key: string; date: Date; count: number }[] }> = ({ data }) => {
  const max = Math.max(1, ...data.map((d) => d.count));
  const weekday = new Intl.DateTimeFormat('fa-IR', { weekday: 'narrow' });
  const day = new Intl.DateTimeFormat('fa-IR', { day: 'numeric' });
  return (
    <div className="flex h-40 items-end gap-1.5" dir="rtl">
      {[...data].reverse().map((d, i) => {
        const h = (d.count / max) * 100;
        const isToday = i === 0;
        return (
          <div key={d.key} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-[10px] font-black text-copper-hi opacity-0 transition-opacity group-hover:opacity-100">
              {fa(d.count)}
            </span>
            <motion.div
              className={`w-full rounded-t-lg ${isToday ? 'bg-gradient-to-t from-[#7A3E14] to-[#E8A672]' : 'bg-gradient-to-t from-copper/25 to-copper/70'}`}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(d.count ? 6 : 2, h)}%` }}
              transition={{ delay: 0.2 + i * 0.035, duration: 0.8, ease: EASE }}
            />
            <span className={`text-[9px] leading-none ${isToday ? 'font-black text-copper-hi' : 'text-ink-3'}`}>
              {isToday ? 'امروز' : weekday.format(d.date)}
            </span>
            <span className="text-[9px] leading-none text-ink-3/70">{day.format(d.date)}</span>
          </div>
        );
      })}
    </div>
  );
};

/** Eight-axis radar of system scores (outer edge = fully systematic). */
export const SystemRadar: React.FC<{
  values: { label: string; value: number }[];
  compare?: number[];
  size?: number;
}> = ({ values, compare, size = 340 }) => {
  const c = size / 2;
  const R = size * 0.33;
  const n = values.length;
  const pt = (i: number, ratio: number) => {
    const a = ((Math.PI * 2) / n) * i - Math.PI / 2;
    return [c + R * ratio * Math.cos(a), c + R * ratio * Math.sin(a)] as const;
  };
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, Math.max(0.04, v / 100)).join(',')).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[360px] overflow-visible" style={{ direction: 'ltr' }}>
      <defs>
        <radialGradient id="og-radar-fill">
          <stop offset="0%" stopColor="#E8A672" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#B87333" stopOpacity="0.45" />
        </radialGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((lvl) => (
        <polygon
          key={lvl}
          points={values.map((_, i) => pt(i, lvl).join(',')).join(' ')}
          fill="none"
          stroke="var(--og-line-strong)"
          strokeDasharray={lvl === 1 ? undefined : '3 4'}
        />
      ))}
      {values.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="var(--og-line)" />;
      })}
      {compare && (
        <polygon points={poly(compare)} fill="none" stroke="var(--og-ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
      )}
      <motion.polygon
        points={poly(values.map((v) => v.value))}
        fill="url(#og-radar-fill)"
        stroke="#D9894A"
        strokeWidth="2.5"
        strokeLinejoin="round"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: EASE }}
        style={{ transformOrigin: `${c}px ${c}px` }}
      />
      {values.map((v, i) => {
        const [x, y] = pt(i, Math.max(0.04, v.value / 100));
        const [lx, ly] = pt(i, 1.24);
        const anchor = lx > c + 12 ? 'start' : lx < c - 12 ? 'end' : 'middle';
        const hex = scoreHex(v.value);
        return (
          <g key={v.label}>
            <motion.circle
              cx={x}
              cy={y}
              r="4.5"
              fill={hex}
              stroke="var(--og-surface)"
              strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.05 }}
            />
            <text x={lx} y={ly - 2} textAnchor={anchor} fontSize="10.5" fontWeight="700" fill="var(--og-ink-2)" style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>
              {v.label}
            </text>
            <text x={lx} y={ly + 11} textAnchor={anchor} fontSize="10" fontWeight="900" fill={hex}>
              {fa(v.value)}٪
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** Horizontal meter used for dimension averages. */
export const Meter: React.FC<{ value: number; delay?: number; className?: string; color?: string }> = ({
  value,
  delay = 0,
  className = '',
  color,
}) => {
  const hex = color || scoreHex(value);
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-surface-2 ${className}`}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${hex}88, ${hex})`, boxShadow: `0 0 12px ${hex}55` }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(2, value)}%` }}
        transition={{ delay, duration: 1, ease: EASE }}
      />
    </div>
  );
};

/** Semicircle gauge from instinct (0) to +3 (100), with an animated needle. */
export const PulseGauge: React.FC<{ value: number }> = ({ value }) => {
  const v = useMotionValue(0);
  const rotate = useTransform(v, [0, 100], [-90, 90]);
  const [text, setText] = useState(fa(0));
  useEffect(() => {
    const c = animate(v, value, { duration: 2, ease: EASE, delay: 0.3, onUpdate: (x) => setText(fa(Math.round(x))) });
    return () => c.stop();
  }, [value, v]);

  return (
    <div className="relative w-full max-w-[300px]" dir="ltr">
      <svg viewBox="-150 -140 300 160" className="w-full">
        <defs>
          <linearGradient id="og-pulse-grad" x1="0" x2="1">
            <stop offset="0%" stopColor="#E05A47" />
            <stop offset="50%" stopColor="#E0B13A" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
        </defs>
        <path d="M -120 0 A 120 120 0 0 1 120 0" fill="none" stroke="var(--og-line)" strokeWidth="22" strokeLinecap="round" />
        <path d="M -120 0 A 120 120 0 0 1 120 0" fill="none" stroke="url(#og-pulse-grad)" strokeWidth="8" strokeLinecap="round" />
        {Array.from({ length: 33 }, (_, i) => {
          const a = Math.PI + (i / 32) * Math.PI;
          const r1 = i % 4 === 0 ? 96 : 100;
          return (
            <line
              key={i}
              x1={Math.cos(a) * r1}
              y1={Math.sin(a) * r1}
              x2={Math.cos(a) * 106}
              y2={Math.sin(a) * 106}
              stroke="var(--og-ink-3)"
              strokeWidth={i % 4 === 0 ? 1.6 : 0.8}
              opacity={0.6}
            />
          );
        })}
        <motion.g style={{ rotate, transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
          <path d="M -3 0 L 0 -92 L 3 0 Z" fill="var(--og-ink)" />
        </motion.g>
        <circle r="9" fill="var(--og-surface)" stroke="#D9894A" strokeWidth="3" />
      </svg>
      <div className="-mt-1 flex items-end justify-between px-1" dir="rtl">
        <span className="pb-1 text-[10px] font-bold text-teal-500">+۳ سیستمی</span>
        <span className="leading-none">
          <span className="text-4xl font-black tabular-nums text-ink">{text}</span>
          <span className="text-lg font-black text-copper-hi">٪</span>
        </span>
        <span className="pb-1 text-[10px] font-bold text-red-500">اورانگوتانی</span>
      </div>
    </div>
  );
};
