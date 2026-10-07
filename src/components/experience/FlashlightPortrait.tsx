import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useMotionTemplate, animate } from 'motion/react';
import { Flashlight } from 'lucide-react';
import authorImg from '../../assets/author_ali.jpg';
import { usePrefersReducedMotion } from './shared';

/**
 * The author's B&W portrait with a warm light the visitor moves across it.
 * When nobody holds the light, it drifts across the face on its own.
 */
export const FlashlightPortrait: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className = '',
  children,
}) => {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const mx = useMotionValue(60);
  const my = useMotionValue(40);
  const mask = useMotionTemplate`radial-gradient(circle at ${mx}% ${my}%, black 0%, black 16%, transparent 42%)`;
  const glow = useMotionTemplate`radial-gradient(circle at ${mx}% ${my}%, rgba(255,190,130,0.22), transparent 38%)`;

  useEffect(() => {
    if (hovering || reducedMotion) return;
    const a = animate(mx, [60, 38, 55, 66, 60], { duration: 12, repeat: Infinity, ease: 'easeInOut' });
    const b = animate(my, [40, 34, 52, 38, 40], { duration: 12, repeat: Infinity, ease: 'easeInOut' });
    return () => {
      a.stop();
      b.stop();
    };
  }, [hovering, reducedMotion, mx, my]);

  const onMove = (e: React.PointerEvent) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <div
      ref={frameRef}
      onPointerMove={onMove}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-black cursor-crosshair touch-pan-y ${className}`}
    >
      <img
        src={authorImg}
        alt={t('author.name')}
        className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.35] contrast-125"
        draggable={false}
      />
      <motion.img
        src={authorImg}
        alt=""
        aria-hidden="true"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        className="absolute inset-0 w-full h-full object-cover [filter:sepia(0.55)_saturate(1.5)_hue-rotate(-12deg)_brightness(1.08)_contrast(1.1)]"
        draggable={false}
      />
      <motion.div style={{ background: glow }} className="absolute inset-0 mix-blend-screen pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
      <div className="absolute bottom-4 inset-x-4 flex items-end justify-between gap-2 text-[11px] font-bold">
        <span className="rounded-full bg-black/60 border border-white/10 px-3 py-1 text-stone-300 backdrop-blur inline-flex items-center gap-1.5">
          <Flashlight className="w-3.5 h-3.5 text-[#D9894A]" />
          {t('story.author.hint')}
        </span>
        {children}
      </div>
    </div>
  );
};
