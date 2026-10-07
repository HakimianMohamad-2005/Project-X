import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react';

/** Wraps children in a gentle pointer-following 3D tilt with a moving glare. */
export const Tilt: React.FC<{ children: React.ReactNode; className?: string; max?: number }> = ({
  children,
  className = '',
  max = 10,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 18 });
  const sy = useSpring(py, { stiffness: 160, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glareX = useTransform(sx, [0, 1], ['0%', '100%']);
  const glareY = useTransform(sy, [0, 1], ['0%', '100%']);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.45), transparent 55%)`;

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} className={`[perspective:900px] ${className}`}>
      <motion.div style={{ rotateX, rotateY }} className="relative [transform-style:preserve-3d]">
        {children}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
          style={{ background: glare }}
        />
      </motion.div>
    </div>
  );
};
