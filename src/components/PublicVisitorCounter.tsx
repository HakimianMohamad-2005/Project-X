/**
 * Public Visitor Counter Component
 * Displayed in the footer.
 * STRICT PRIVACY REQUIREMENT:
 * - Shows ONLY the Total Visitor Count.
 * - Absolutely NO live active online counts or technical details are exposed publicly.
 * - Includes subtle hidden trigger for /admin and Keyboard Shortcut (Ctrl + Shift + A).
 */

import React, { useEffect } from 'react';
import { Users, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVisitor } from '../context/VisitorContext';
import { toPersianDigits } from '../utils/persian';

interface PublicVisitorCounterProps {
  onOpenAdmin: () => void;
  theme?: 'dark' | 'light';
}

export const PublicVisitorCounter: React.FC<PublicVisitorCounterProps> = ({ onOpenAdmin, theme = 'light' }) => {
  const { t, i18n } = useTranslation();
  const { totalVisitors } = useVisitor();
  const isFa = i18n.language === 'fa';

  // Global Keyboard Shortcut: Ctrl + Shift + A to open Admin Gate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        onOpenAdmin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenAdmin]);

  const formattedCount = isFa
    ? toPersianDigits(totalVisitors.toLocaleString('fa-IR'))
    : totalVisitors.toLocaleString('en-US');

  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-line bg-surface px-3.5 py-2 text-ink">
      {/* Live Blue Pulsing Indicator (Strictly for Public Counter) */}
      <div className="relative flex items-center justify-center w-3 h-3 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
      </div>

      {/* Label and Formatted Count */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <Users className="w-3.5 h-3.5 text-copper-hi shrink-0" />
        <span className="text-ink-2">
          {t('telemetry.totalVisitorsLabel', 'مجموع مراجعین رسمی سایت:')}
        </span>
        <span className="font-extrabold text-copper-hi text-sm tabular-nums">
          {formattedCount}
        </span>
        <span className="text-[11px] opacity-75">
          {t('telemetry.personSuffix', 'نفر')}
        </span>
      </div>

      {/* Secret Subtle Link to Admin Gate */}
      <button
        onClick={onOpenAdmin}
        className="opacity-30 hover:opacity-100 transition-opacity p-1 text-ink-3 hover:text-copper-hi"
        title="دسترسی مدیریت سامانه (Ctrl + Shift + A)"
        aria-label="Admin Access"
      >
        <Shield className="w-3 h-3" />
      </button>
    </div>
  );
};
