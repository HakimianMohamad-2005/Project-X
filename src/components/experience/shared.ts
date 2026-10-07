import { useEffect, useState } from 'react';
import { toPersianDigits } from '../../utils/persian';

export const COPPER = '#B87333';

/**
 * Clamped linear map. Used with function-form useTransform so scroll-linked
 * opacity stays on the JS path (the accelerated scroll-timeline path does not
 * track sticky sections inside this layout reliably).
 */
export function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  const t = Math.min(1, Math.max(0, (v - inMin) / (inMax - inMin)));
  return outMin + (outMax - outMin) * t;
}

/** Formats digits for the active language (Persian digits for fa). */
export function localizeDigits(value: string | number, lang: string): string {
  return lang === 'fa' ? toPersianDigits(value) : String(value);
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/** True on devices with a precise pointer (mouse / trackpad). */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(pointer: fine)').matches
      : false
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(pointer: fine)');
    const onChange = () => setFine(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return fine;
}
