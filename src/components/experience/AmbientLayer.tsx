import React, { useEffect } from 'react';
import { motion, useScroll, useSpring, useMotionValue } from 'motion/react';
import { ThemeMode } from '../../types';
import { useFinePointer, usePrefersReducedMotion } from './shared';

/**
 * Site-wide atmosphere: a copper reading-progress line, a soft light that
 * follows the cursor and a whisper of film grain (dark theme only).
 */
export const AmbientLayer: React.FC<{ theme: ThemeMode }> = ({ theme }) => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const isDark = theme === 'dark';
  const showGlow = isDark && finePointer && !reducedMotion;

  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 220, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (!showGlow) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [showGlow, x, y]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed top-0 inset-x-0 h-[2px] z-[60] origin-left rtl:origin-right bg-gradient-to-r from-[#8B4513] via-[#D9894A] to-[#FFD3A1] pointer-events-none"
      />
      {showGlow && (
        <motion.div
          aria-hidden="true"
          style={{ x: sx, y: sy }}
          className="fixed top-0 left-0 z-[1] -ml-[260px] -mt-[260px] h-[520px] w-[520px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(217,137,74,0.07),transparent_65%)]"
        />
      )}
      {isDark && (
        <div aria-hidden="true" className="og-grain fixed inset-0 z-[55] pointer-events-none opacity-[0.035]" />
      )}
    </>
  );
};
