import React from 'react';
import { DimensionResult } from '../lib/managerAssessment';
import { toPersianDigits } from '../utils/persian';

interface RadarDimensionChartProps {
  dimensions: DimensionResult[];
  isLight?: boolean;
  isPersian?: boolean;
}

export const RadarDimensionChart: React.FC<RadarDimensionChartProps> = ({
  dimensions,
  isLight = true,
  isPersian = true
}) => {
  const size = 380;
  const center = size / 2;
  const radius = size * 0.36;
  const total = dimensions.length;

  // Grid levels (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Calculate coordinates for polygon vertices
  const getCoordinates = (index: number, valueRatio: number, customRadius = radius) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = customRadius * valueRatio;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Build polygon points string for data
  const dataPoints = dimensions.map((d, i) => {
    const ratio = Math.max(d.percentage, 5) / 100;
    const { x, y } = getCoordinates(i, ratio);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full">
      {/* Desktop & Tablet Radar View */}
      <div className="hidden md:flex flex-col items-center justify-center relative p-4">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          {/* Background web circles / octagons */}
          {levels.map((lvl, idx) => {
            const levelPoints = Array.from({ length: total }).map((_, i) => {
              const { x, y } = getCoordinates(i, lvl);
              return `${x},${y}`;
            }).join(' ');

            return (
              <g key={`level-${idx}`}>
                <polygon
                  points={levelPoints}
                  fill={idx === levels.length - 1 ? (isLight ? 'rgba(245, 245, 244, 0.4)' : 'rgba(30, 32, 34, 0.4)') : 'none'}
                  stroke={isLight ? '#E7E5E4' : '#393C40'}
                  strokeWidth="1"
                  strokeDasharray={idx === levels.length - 1 ? 'none' : '3 3'}
                />
                {/* Level Percentage Label */}
                <text
                  x={center + 6}
                  y={center - radius * lvl + 10}
                  fontSize="9"
                  fill={isLight ? '#A8A29E' : '#78716C'}
                  textAnchor="start"
                  className="font-mono font-medium"
                >
                  {isPersian ? `%${toPersianDigits(Math.round(lvl * 100))}` : `${Math.round(lvl * 100)}%`}
                </text>
              </g>
            );
          })}

          {/* Radial axis lines */}
          {dimensions.map((_, i) => {
            const end = getCoordinates(i, 1.0);
            return (
              <line
                key={`axis-${i}`}
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke={isLight ? '#D6D3D1' : '#44403C'}
                strokeWidth="1"
              />
            );
          })}

          {/* User Score Filled Polygon */}
          <polygon
            points={dataPoints}
            fill="rgba(184, 115, 51, 0.28)"
            stroke="#B87333"
            strokeWidth="2.5"
            className="transition-all duration-700 ease-out"
          />

          {/* Dimension Vertex Points & Labels */}
          {dimensions.map((dim, i) => {
            const ratio = Math.max(dim.percentage, 5) / 100;
            const pt = getCoordinates(i, ratio);
            const labelPt = getCoordinates(i, 1.26);

            // Determine text anchor based on X position
            let anchor: 'middle' | 'start' | 'end' = 'middle';
            if (labelPt.x > center + 20) anchor = isPersian ? 'end' : 'start';
            else if (labelPt.x < center - 20) anchor = isPersian ? 'start' : 'end';

            const isHigh = dim.percentage >= 60;
            const isMedium = dim.percentage >= 35 && dim.percentage < 60;

            const pointColor = isHigh ? '#EF4444' : isMedium ? '#F59E0B' : '#14B8A6';

            return (
              <g key={`vertex-${dim.dimension}`}>
                {/* Vertex dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill={pointColor}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="shadow"
                />

                {/* Outer Label */}
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor={anchor}
                  fontSize="11"
                  fontWeight="bold"
                  fill={isLight ? '#292524' : '#FAF7F2'}
                  className="select-none"
                >
                  {dim.titleFa}
                </text>
                <text
                  x={labelPt.x}
                  y={labelPt.y + 13}
                  textAnchor={anchor}
                  fontSize="10"
                  fontWeight="bold"
                  fill={pointColor}
                  className="select-none font-mono"
                >
                  {isPersian ? `%${toPersianDigits(dim.percentage)} درگیری` : `${dim.percentage}%`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile-Friendly Bar Breakdown */}
      <div className="md:hidden space-y-3.5 pt-2">
        {dimensions.map((dim) => {
          const isHigh = dim.percentage >= 60;
          const isMedium = dim.percentage >= 35 && dim.percentage < 60;
          const barColor = isHigh 
            ? 'bg-red-500' 
            : isMedium 
              ? 'bg-amber-500' 
              : 'bg-teal-500';
          const textColor = isHigh 
            ? 'text-red-600 dark:text-red-400' 
            : isMedium 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-teal-600 dark:text-teal-400';

          return (
            <div key={dim.dimension} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className={isLight ? 'text-stone-800' : 'text-stone-200'}>
                  {dim.titleFa}
                </span>
                <span className={`font-mono ${textColor}`}>
                  {isPersian ? `%${toPersianDigits(dim.percentage)}` : `${dim.percentage}%`}
                </span>
              </div>
              <div className={`w-full h-2.5 rounded-full overflow-hidden ${isLight ? 'bg-stone-200' : 'bg-stone-800'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${Math.max(dim.percentage, 4)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
