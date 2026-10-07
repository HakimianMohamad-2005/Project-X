import React from 'react';

const COVERS: Record<string, string[]> = {
  'vol-1': ['/Jeld%20-%20Front.png'],
  'vol-2': ['/Jeld2%20-%20Front.png'],
  'bundle-full': ['/Jeld2%20-%20Front.png', '/Jeld%20-%20Front.png'],
};

/** Small cover artwork for cart lines and receipts (bundle shows both volumes). */
export const CoverThumb: React.FC<{ bookId: string; className?: string }> = ({ bookId, className = '' }) => {
  const covers = COVERS[bookId] || COVERS['vol-1'];
  return (
    <span className={`relative inline-block h-20 w-16 shrink-0 ${className}`} aria-hidden="true">
      {covers.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          draggable={false}
          className="absolute top-0 h-full w-[52px] rounded-[5px] object-cover shadow-[0_8px_18px_-6px_rgba(0,0,0,0.6)] ring-1 ring-black/20"
          style={
            covers.length > 1
              ? { insetInlineStart: i === 0 ? 0 : 12, transform: `rotate(${i === 0 ? -6 : 3}deg)`, zIndex: i }
              : { insetInlineStart: 6 }
          }
        />
      ))}
    </span>
  );
};
