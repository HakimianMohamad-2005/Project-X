import React, { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, HTMLMotionProps } from 'motion/react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ------------------------------------------------------------------
   Layout
   ------------------------------------------------------------------ */

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades content up as it scrolls into view. */
export const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number; y?: number }> = ({
  children,
  className = '',
  delay = 0,
  y = 22,
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.7, delay, ease: EASE }}
    className={className}
  >
    {children}
  </motion.div>
);

/** Thin compass arcs echoing the book cover's dial. */
const CompassArcs: React.FC<{ className?: string }> = ({ className = '' }) => {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <svg viewBox="-300 -300 600 600" className={className} aria-hidden="true">
      <g className="og-spin-slow" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle r="290" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        {ticks.map((deg) => {
          const a = (deg * Math.PI) / 180;
          const long = deg % 30 === 0;
          return (
            <line
              key={deg}
              x1={Math.cos(a) * (long ? 266 : 276)}
              y1={Math.sin(a) * (long ? 266 : 276)}
              x2={Math.cos(a) * 286}
              y2={Math.sin(a) * 286}
              stroke="currentColor"
              strokeOpacity={long ? 0.9 : 0.45}
            />
          );
        })}
      </g>
      <circle r="220" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="2 9" />
    </svg>
  );
};

interface PageHeaderProps {
  icon?: React.ComponentType<{ className?: string }>;
  kicker: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

/** Cinematic header shared by every inner page. */
export const PageHeader: React.FC<PageHeaderProps> = ({ icon: Icon, kicker, title, subtitle, children }) => (
  <header className="relative isolate overflow-hidden border-b border-line">
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(184,115,51,0.18),transparent_70%)]" />
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--og-line)_1px,transparent_1px),linear-gradient(90deg,var(--og-line)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,black,transparent)]" />
      <CompassArcs className="absolute left-1/2 -top-[340px] w-[680px] h-[680px] -translate-x-1/2 text-copper/30" />
    </div>
    <Container className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
        className="max-w-3xl mx-auto flex flex-col items-center gap-5"
      >
        <motion.span
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          className="inline-flex items-center gap-2 rounded-full border border-copper/35 bg-copper/10 px-3.5 py-1.5 text-xs font-bold text-copper-hi"
        >
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {kicker}
        </motion.span>
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 18, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-3xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight leading-[1.2] text-ink text-balance"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            className="text-sm sm:text-base leading-8 text-ink-2 max-w-2xl text-pretty"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="pt-1">
            {children}
          </motion.div>
        )}
      </motion.div>
    </Container>
  </header>
);

/** Small section heading used inside pages. */
export const SectionTitle: React.FC<{ kicker?: string; title: string; subtitle?: string; className?: string }> = ({
  kicker,
  title,
  subtitle,
  className = '',
}) => (
  <div className={`space-y-2 ${className}`}>
    {kicker && <span className="text-[11px] font-black tracking-[0.2em] uppercase text-copper-hi">{kicker}</span>}
    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-ink">{title}</h2>
    {subtitle && <p className="text-sm leading-7 text-ink-2">{subtitle}</p>}
  </div>
);

/* ------------------------------------------------------------------
   Surfaces
   ------------------------------------------------------------------ */

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }> = ({
  className = '',
  interactive,
  children,
  ...rest
}) => (
  <div
    className={`rounded-3xl border border-line bg-surface ${
      interactive ? 'transition-all duration-300 hover:border-copper/50 hover:-translate-y-0.5 hover:og-shadow' : ''
    } ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export const IconTile: React.FC<{ icon: React.ComponentType<{ className?: string }>; tone?: 'copper' | 'red' | 'green' | 'neutral'; className?: string }> = ({
  icon: Icon,
  tone = 'copper',
  className = '',
}) => {
  const tones = {
    copper: 'bg-copper/12 text-copper-hi border-copper/25',
    red: 'bg-red-500/10 text-red-500 border-red-500/25',
    green: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25',
    neutral: 'bg-surface-2 text-ink-2 border-line',
  }[tone];
  return (
    <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${tones} ${className}`}>
      <Icon className="w-5 h-5" />
    </span>
  );
};

/* ------------------------------------------------------------------
   Buttons
   ------------------------------------------------------------------ */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra = ''): string {
  const base =
    'relative inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none select-none';
  const sizes = {
    sm: 'h-9 px-3.5 rounded-xl text-xs',
    md: 'h-11 px-5 rounded-2xl text-sm',
    lg: 'h-14 px-7 rounded-2xl text-base',
  }[size];
  const variants = {
    primary:
      'text-white bg-gradient-to-br from-[#D9894A] via-[#B87333] to-[#7A3E14] shadow-[0_10px_30px_-12px_rgba(217,137,74,0.8)] hover:brightness-110',
    secondary: 'text-ink bg-surface border border-line-strong hover:border-copper/60 hover:text-copper-hi',
    ghost: 'text-ink-2 hover:text-ink hover:bg-surface-2',
    success:
      'text-white bg-gradient-to-br from-emerald-500 to-teal-700 shadow-[0_10px_30px_-12px_rgba(16,185,129,0.7)] hover:brightness-110',
  }[variant];
  return `${base} ${sizes} ${variants} ${extra}`;
}

export const Button: React.FC<
  Omit<HTMLMotionProps<'button'>, 'children'> & { variant?: ButtonVariant; size?: ButtonSize; children?: React.ReactNode }
> = ({ variant = 'primary', size = 'md', className = '', children, type = 'button', ...rest }) => (
  <motion.button
    type={type}
    whileTap={{ scale: 0.97 }}
    className={buttonClass(variant, size, className as string)}
    {...rest}
  >
    {children}
  </motion.button>
);

/* ------------------------------------------------------------------
   Filter tabs with a sliding active pill
   ------------------------------------------------------------------ */

export interface TabOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number | string;
}

export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
  className = '',
  tone = 'copper',
}: {
  options: TabOption<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  tone?: 'copper' | 'red' | 'green';
}) {
  const id = useId();
  const pill = {
    copper: 'bg-gradient-to-br from-[#D9894A] to-[#8B4513]',
    red: 'bg-gradient-to-br from-red-500 to-red-700',
    green: 'bg-gradient-to-br from-emerald-500 to-teal-700',
  }[tone];
  return (
    <div className={`og-no-scrollbar flex max-w-full overflow-x-auto ${className}`}>
      <div role="tablist" className="mx-auto inline-flex shrink-0 gap-1 rounded-2xl border border-line bg-surface p-1">
        {options.map((o) => {
          const active = o.value === value;
          const Icon = o.icon;
          return (
            <button
              key={o.value}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(o.value)}
              className={`relative inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-colors ${
                active ? 'text-white' : 'text-ink-2 hover:text-ink'
              }`}
            >
              {active && (
                <motion.span
                  layoutId={`tab-pill-${id}`}
                  className={`absolute inset-0 rounded-xl ${pill} shadow-md`}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              {Icon && <Icon className="relative w-4 h-4" />}
              <span className="relative">{o.label}</span>
              {o.count !== undefined && (
                <span
                  className={`relative rounded-md px-1.5 text-[10px] font-black ${
                    active ? 'bg-black/25 text-white' : 'bg-surface-2 text-ink-3'
                  }`}
                >
                  {o.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Form fields
   ------------------------------------------------------------------ */

export const inputClass =
  'w-full min-w-0 rounded-xl border border-line-strong bg-field px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-3 transition-colors focus:outline-none focus:border-copper focus:ring-4 focus:ring-copper/15';

export const Field: React.FC<{
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, icon: Icon, required, hint, children, className = '' }) => (
  <label className={`block min-w-0 space-y-1.5 ${className}`}>
    <span className="flex items-center justify-between gap-2 text-xs font-bold text-ink-2">
      <span className="inline-flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-copper-hi" />}
        {label}
        {required && <span className="text-copper-hi">*</span>}
      </span>
      {hint && <span className="text-[11px] font-medium text-ink-3">{hint}</span>}
    </span>
    {children}
  </label>
);

export const Check: React.FC<{ checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }> = ({
  checked,
  onChange,
  children,
}) => (
  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface-2/60 p-3 text-sm text-ink-2 transition-colors hover:border-copper/40">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
    <span
      aria-hidden="true"
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-copper ${
        checked ? 'border-copper bg-copper text-white' : 'border-line-strong bg-field'
      }`}
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="h-3 w-3">
          <path d="M2 6.5 4.8 9 10 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    <span className="leading-6">{children}</span>
  </label>
);

/* ------------------------------------------------------------------
   Overlays
   ------------------------------------------------------------------ */

function useOverlayBehaviour(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);
}

const CloseButton: React.FC<{ onClick: () => void; className?: string }> = ({ onClick, className = '' }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      aria-label={t('ui.common.close')}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-2/80 text-ink-2 backdrop-blur transition-colors hover:text-ink hover:border-copper/50 ${className}`}
    >
      <X className="w-4 h-4" />
    </button>
  );
};

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Hide the floating close button (e.g. while an action is processing). */
  hideClose?: boolean;
}> = ({ open, onClose, children, size = 'md', hideClose }) => {
  useOverlayBehaviour(open, onClose);
  const width = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size];

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE }}
            className={`relative w-full ${width} max-h-[92svh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] border border-line bg-surface text-ink og-shadow`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(184,115,51,0.16),transparent_70%)]" />
            {!hideClose && <CloseButton onClick={onClose} className="absolute top-4 end-4 z-10" />}
            <div className="relative">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export const Drawer: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({
  open,
  onClose,
  children,
}) => {
  useOverlayBehaviour(open, onClose);
  const { i18n } = useTranslation();
  const rtl = i18n.language === 'fa' || i18n.language === 'ar';
  // Slides in from the reading-end edge (left in RTL, right in LTR).
  const offscreen = rtl ? '-100%' : '100%';

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
          <motion.div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: offscreen }}
            animate={{ x: 0 }}
            exit={{ x: offscreen }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
            className={`absolute inset-y-0 ${rtl ? 'left-0 border-r' : 'right-0 border-l'} flex w-full max-w-md flex-col border-line bg-surface text-ink og-shadow`}
          >
            <CloseButton onClick={onClose} className="absolute top-5 end-5 z-10" />
            {children}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

/** Big centered success state used by forms and checkout. */
export const SuccessState: React.FC<{ title: string; text?: string; children?: React.ReactNode }> = ({ title, text, children }) => (
  <div className="flex flex-col items-center text-center gap-5 py-6">
    <motion.span
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-500 ring-8 ring-emerald-500/5"
    >
      <svg viewBox="0 0 24 24" className="h-10 w-10">
        <motion.path
          d="M5 12.5 10 17 19 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
      </svg>
    </motion.span>
    <div className="space-y-2">
      <h3 className="text-xl sm:text-2xl font-black text-ink">{title}</h3>
      {text && <p className="mx-auto max-w-md text-sm leading-7 text-ink-2">{text}</p>}
    </div>
    {children}
  </div>
);
