import React from 'react';

interface Book3DProps {
  cover: string;
  alt: string;
  /** Cover width in px; height follows the real cover aspect ratio. */
  width?: number;
  depth?: number;
  className?: string;
  style?: React.CSSProperties;
}

const COVER_RATIO = 1280 / 901;

/**
 * A physical-looking hardcover: front cover, page block, spine and back.
 * Persian books bind on the right, so the page edges face left.
 * Rotation is controlled by the parent (it inherits preserve-3d).
 */
export const Book3D: React.FC<Book3DProps> = ({
  cover,
  alt,
  width = 240,
  depth = 36,
  className = '',
  style,
}) => {
  const height = Math.round(width * COVER_RATIO);
  const half = depth / 2;

  return (
    <div
      className={`relative [transform-style:preserve-3d] ${className}`}
      style={{ width, height, ...style }}
    >
      {/* Front cover */}
      <div
        className="absolute inset-0 rounded-e-[6px] rounded-s-[3px] overflow-hidden [backface-visibility:hidden]"
        style={{ transform: `translateZ(${half}px)` }}
      >
        <img
          src={cover}
          alt={alt}
          draggable={false}
          className="w-full h-full object-cover select-none"
          referrerPolicy="no-referrer"
        />
        {/* Hinge crease near the spine (right side) */}
        <div className="absolute inset-y-0 right-[10px] w-[3px] bg-gradient-to-l from-white/0 via-black/40 to-white/10" />
        {/* Glossy light sweep */}
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0)_35%,rgba(255,220,180,0.16)_48%,rgba(255,255,255,0)_60%)] mix-blend-screen" />
        <div className="absolute inset-0 ring-1 ring-inset ring-[#D9894A]/25 rounded-[inherit]" />
      </div>

      {/* Page block (left edge) */}
      <div
        className="absolute top-[4px] bottom-[4px]"
        style={{
          width: depth - 4,
          left: (width - (depth - 4)) / 2,
          transform: `rotateY(-90deg) translateZ(${width / 2 - 2}px)`,
          background:
            'repeating-linear-gradient(90deg, #f3ece0 0px, #f3ece0 1px, #d9cfbf 1.5px, #efe7da 2.5px)',
          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.35)',
        }}
      />

      {/* Page block (top edge) */}
      <div
        className="absolute left-[2px]"
        style={{
          width: width - 10,
          height: depth - 4,
          top: (height - (depth - 4)) / 2,
          transform: `rotateX(90deg) translateZ(${height / 2 - 2}px)`,
          background:
            'repeating-linear-gradient(0deg, #f3ece0 0px, #f3ece0 1px, #d9cfbf 1.5px, #efe7da 2.5px)',
        }}
      />

      {/* Spine (right edge) */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          width: depth,
          left: (width - depth) / 2,
          transform: `rotateY(90deg) translateZ(${width / 2}px)`,
          background: 'linear-gradient(90deg, #1a1412 0%, #3a2a22 45%, #1a1412 100%)',
        }}
      >
        <div className="absolute inset-x-0 top-6 h-px bg-[#D9894A]/60" />
        <div className="absolute inset-x-0 bottom-6 h-px bg-[#D9894A]/60" />
      </div>

      {/* Back cover */}
      <div
        className="absolute inset-0 rounded-[4px] bg-[#16110f]"
        style={{ transform: `translateZ(${-half}px) rotateY(180deg)` }}
      />
    </div>
  );
};
