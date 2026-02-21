'use client';

import { motion } from 'framer-motion';
import { CareerEvent } from '@/types/career';
import { Point } from '@/lib/svg-utils';

interface EventNodeProps {
  event: CareerEvent;
  position: Point;
  index: number;
  isCurrent: boolean;
  isDragging: boolean;
  onDragStart: (e: React.MouseEvent) => void;
}

const EVENT_COLORS: Record<CareerEvent['type'], string> = {
  study: '#60a5fa',
  work: '#34d399',
  training: '#a78bfa',
  other: '#94a3b8',
};

export default function EventNode({ event, position, index, isCurrent, isDragging, onDragStart }: EventNodeProps) {
  const color = EVENT_COLORS[event.type];
  const radius = isCurrent ? 14 : 10;
  const labelY = index % 2 === 0 ? position.y - 36 : position.y + 36;
  const labelAnchorY = index % 2 === 0 ? -1 : 1;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', stiffness: 200 }}
    >
      {/* Glow rings for current node */}
      {isCurrent && (
        <>
          <motion.circle
            cx={position.x} cy={position.y} r={28}
            fill={color} opacity={0.1}
            animate={{ r: [28, 36, 28] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx={position.x} cy={position.y} r={20}
            fill={color} opacity={0.2}
            animate={{ r: [20, 26, 20] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </>
      )}

      {/* Drag highlight ring */}
      {isDragging && (
        <circle
          cx={position.x} cy={position.y} r={radius + 8}
          fill="none" stroke={color} strokeWidth={1.5} strokeOpacity={0.5}
          strokeDasharray="4 3"
        />
      )}

      {/* Hit area (larger invisible circle for easier grab) */}
      <circle
        cx={position.x} cy={position.y}
        r={radius + 10}
        fill="transparent"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={onDragStart}
      />

      {/* Main circle */}
      <circle
        cx={position.x} cy={position.y} r={radius}
        fill={color}
        stroke="#0a0a0f" strokeWidth={2}
        filter={isCurrent ? 'url(#glow)' : undefined}
        style={{ pointerEvents: 'none' }}
      />

      {/* Inner dot */}
      {!isCurrent && (
        <circle cx={position.x} cy={position.y} r={4} fill="#0a0a0f" style={{ pointerEvents: 'none' }} />
      )}

      {/* NOW label */}
      {isCurrent && (
        <text
          x={position.x} y={position.y + 4}
          textAnchor="middle" fill="#0a0a0f"
          fontSize={7} fontWeight="bold" fontFamily="monospace"
          style={{ pointerEvents: 'none' }}
        >
          NOW
        </text>
      )}

      {/* Connector to label */}
      <line
        x1={position.x}
        y1={position.y + (labelAnchorY < 0 ? -radius : radius)}
        x2={position.x}
        y2={labelY + (labelAnchorY < 0 ? 14 : -4)}
        stroke={color} strokeWidth={1} strokeOpacity={0.4} strokeDasharray="2 2"
        style={{ pointerEvents: 'none' }}
      />

      {/* Label box */}
      <rect
        x={position.x - 54}
        y={labelY + (labelAnchorY < 0 ? -28 : 0)}
        width={108} height={28} rx={6}
        fill="#111827" stroke={color} strokeWidth={0.8} strokeOpacity={0.5}
        style={{ pointerEvents: 'none' }}
      />

      {/* Title */}
      <text
        x={position.x}
        y={labelY + (labelAnchorY < 0 ? -12 : 12)}
        textAnchor="middle" fill={color}
        fontSize={10} fontWeight="bold" fontFamily="'Inter', sans-serif"
        style={{ pointerEvents: 'none' }}
      >
        {event.title.length > 14 ? event.title.slice(0, 13) + '…' : event.title}
      </text>

      {/* Year */}
      <text
        x={position.x}
        y={labelY + (labelAnchorY < 0 ? 0 : 24)}
        textAnchor="middle" fill="#94a3b8"
        fontSize={8} fontFamily="monospace"
        style={{ pointerEvents: 'none' }}
      >
        {event.startYear}{event.endYear && event.endYear !== event.startYear ? `–${event.endYear}` : ''}
      </text>
    </motion.g>
  );
}
