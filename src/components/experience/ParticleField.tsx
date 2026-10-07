import React, { useEffect, useRef } from 'react';

/**
 * "Instinct vs. System" particle field.
 *
 * Particles wander chaotically (the instinctive, orangutan state) until they
 * fall under the manager's attention — the pointer, or an autopilot gaze when
 * idle. There they snap onto a grid and travel as clean copper circuit traces
 * (the +3 state). One side of the field is naturally more ordered, echoing
 * the book cover: rusted chaos on one side, glowing circuitry on the other.
 */

interface ParticleFieldProps {
  className?: string;
  /** Which physical side is more "systemic" by default. */
  orderSide?: 'left' | 'right';
  reducedMotion?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dir: number; // 0:right 1:down 2:left 3:up (ordered mode)
  ordered: boolean;
  threshold: number;
  trail: number[]; // flat [x0,y0,x1,y1,...]
  tick: number;
}

interface Node {
  x: number;
  y: number;
  born: number;
}

const GRID = 34;
const TRAIL_POINTS = 22;
const ATTENTION_RADIUS = 210;
const NODE_LIFE = 2600;

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  className = '',
  orderSide = 'right',
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let nodes: Node[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    let last = performance.now();
    const start = last;

    const pointer = { x: 0, y: 0, active: false, lastMove: 0 };
    const gaze = { x: 0, y: 0 };

    const spawn = (p?: Particle): Particle => {
      const target = p ?? ({} as Particle);
      target.x = Math.random() * width;
      target.y = Math.random() * height;
      const a = Math.random() * Math.PI * 2;
      target.vx = Math.cos(a) * 0.6;
      target.vy = Math.sin(a) * 0.6;
      target.dir = Math.floor(Math.random() * 4);
      target.ordered = false;
      target.threshold = 0.25 + Math.random() * 0.7;
      target.trail = [];
      target.tick = 0;
      return target;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(170, Math.max(55, (width * height) / 8500)));
      if (particles.length > count) particles.length = count;
      while (particles.length < count) particles.push(spawn());
      particles.forEach((p) => {
        if (p.x > width || p.y > height) spawn(p);
      });
    };

    const orderAt = (x: number, y: number, t: number) => {
      const xn = orderSide === 'right' ? x / width : 1 - x / width;
      let o = 0.04 + 0.62 * smoothstep(0.38, 1.05, xn);

      // The manager's attention: pointer if recently moved, otherwise an
      // autopilot gaze drifting on a slow Lissajous path.
      const usePointer = pointer.active && t - pointer.lastMove < 2500;
      const ax = usePointer ? pointer.x : gaze.x;
      const ay = usePointer ? pointer.y : gaze.y;
      const d = Math.hypot(x - ax, y - ay);
      if (d < ATTENTION_RADIUS) o += (1 - d / ATTENTION_RADIUS) * 1.1;
      return o;
    };

    const step = (dt: number, t: number) => {
      const k = Math.min(dt / 16.67, 3);
      gaze.x = width * (0.5 + 0.32 * Math.sin(t * 0.00021));
      gaze.y = height * (0.5 + 0.3 * Math.sin(t * 0.00033 + 1.3));

      for (const p of particles) {
        const wantOrdered = orderAt(p.x, p.y, t) > p.threshold;

        if (wantOrdered && !p.ordered) {
          // Snap onto the circuit grid, keep the dominant heading.
          p.ordered = true;
          if (Math.abs(p.vx) > Math.abs(p.vy)) {
            p.dir = p.vx >= 0 ? 0 : 2;
            p.y = Math.round(p.y / GRID) * GRID;
          } else {
            p.dir = p.vy >= 0 ? 1 : 3;
            p.x = Math.round(p.x / GRID) * GRID;
          }
          nodes.push({ x: p.x, y: p.y, born: t });
        } else if (!wantOrdered && p.ordered) {
          p.ordered = false;
          const [dx, dy] = DIRS[p.dir];
          p.vx = dx * 0.9;
          p.vy = dy * 0.9;
        }

        if (p.ordered) {
          const speed = 1.7 * k;
          const [dx, dy] = DIRS[p.dir];
          const prevX = p.x;
          const prevY = p.y;
          p.x += dx * speed;
          p.y += dy * speed;

          // Crossed a grid intersection? Maybe turn 90°.
          const crossedX = dx !== 0 && Math.floor(prevX / GRID) !== Math.floor(p.x / GRID);
          const crossedY = dy !== 0 && Math.floor(prevY / GRID) !== Math.floor(p.y / GRID);
          if ((crossedX || crossedY) && Math.random() < 0.22) {
            if (crossedX) p.x = Math.round(p.x / GRID) * GRID;
            if (crossedY) p.y = Math.round(p.y / GRID) * GRID;
            p.dir = (p.dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
            nodes.push({ x: p.x, y: p.y, born: t });
          }
          p.vx = dx;
          p.vy = dy;
        } else {
          p.vx += (Math.random() - 0.5) * 0.42 * k;
          p.vy += (Math.random() - 0.5) * 0.42 * k;
          p.vx *= 0.965;
          p.vy *= 0.965;
          const s = Math.hypot(p.vx, p.vy);
          if (s > 1.35) {
            p.vx = (p.vx / s) * 1.35;
            p.vy = (p.vy / s) * 1.35;
          }
          p.x += p.vx * k;
          p.y += p.vy * k;
        }

        if (p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
          spawn(p);
          continue;
        }

        p.tick += 1;
        if (p.tick % 2 === 0) {
          p.trail.push(p.x, p.y);
          if (p.trail.length > TRAIL_POINTS * 2) p.trail.splice(0, 2);
        }
      }

      if (nodes.length > 260) nodes.splice(0, nodes.length - 260);
      nodes = nodes.filter((n) => t - n.born < NODE_LIFE);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      // Soft halo where attention is focused.
      const usePointer = pointer.active && t - pointer.lastMove < 2500;
      const hx = usePointer ? pointer.x : gaze.x;
      const hy = usePointer ? pointer.y : gaze.y;
      const halo = ctx.createRadialGradient(hx, hy, 0, hx, hy, ATTENTION_RADIUS * 1.3);
      halo.addColorStop(0, 'rgba(217,137,74,0.10)');
      halo.addColorStop(1, 'rgba(217,137,74,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(hx - ATTENTION_RADIUS * 1.3, hy - ATTENTION_RADIUS * 1.3, ATTENTION_RADIUS * 2.6, ATTENTION_RADIUS * 2.6);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (const p of particles) {
        const tr = p.trail;
        const n = tr.length / 2;
        if (n > 1) {
          // Draw the trail in 4 alpha buckets: cheap gradient fade.
          const buckets = 4;
          for (let b = 0; b < buckets; b++) {
            const from = Math.floor((b * (n - 1)) / buckets);
            const to = Math.floor(((b + 1) * (n - 1)) / buckets);
            if (to <= from) continue;
            const alpha = ((b + 1) / buckets) * (p.ordered ? 0.75 : 0.32);
            ctx.strokeStyle = p.ordered ? `rgba(217,137,74,${alpha})` : `rgba(150,118,100,${alpha})`;
            ctx.lineWidth = p.ordered ? 1.3 : 1;
            ctx.beginPath();
            ctx.moveTo(tr[from * 2], tr[from * 2 + 1]);
            for (let i = from + 1; i <= to; i++) ctx.lineTo(tr[i * 2], tr[i * 2 + 1]);
            ctx.stroke();
          }
          const lx = tr[(n - 1) * 2];
          const ly = tr[(n - 1) * 2 + 1];
          ctx.strokeStyle = p.ordered ? 'rgba(217,137,74,0.8)' : 'rgba(150,118,100,0.35)';
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }

        if (p.ordered) {
          ctx.fillStyle = 'rgba(255,190,130,0.16)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFD3A1';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(170,140,120,0.55)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Solder points where traces turned.
      for (const node of nodes) {
        const life = 1 - (t - node.born) / NODE_LIFE;
        if (life <= 0) continue;
        ctx.strokeStyle = `rgba(217,137,74,${0.55 * life})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.6, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      step(dt, now - start);
      draw(now - start);
      raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (running || reducedMotion) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointer.x = x;
      pointer.y = y;
      pointer.lastMove = performance.now() - start;
    };

    const onVisibility = () => {
      if (document.hidden) stopLoop();
      else if (visible) startLoop();
    };

    resize();

    if (reducedMotion) {
      // Settle into a calm, static composition.
      for (let i = 0; i < 140; i++) step(16.67, i * 16.67);
      draw(140 * 16.67);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) startLoop();
        else stopLoop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (reducedMotion) draw(0);
    });
    ro.observe(canvas);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [orderSide, reducedMotion]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`block w-full h-full ${className}`} />;
};
