'use client';

import { motion } from 'framer-motion';
import { Objective } from '@/types/career';
import { Point, buildSinuousPath } from '@/lib/svg-utils';

interface ObjectivePathProps {
  objective: Objective;
  waypoints: Point[];
  objectiveIndex: number;
  draggingKey: string | null;
  onNodeDragStart: (key: string, pos: Point) => (e: React.MouseEvent) => void;
}

export default function ObjectivePath({
  objective,
  waypoints,
  draggingKey,
  onNodeDragStart,
}: ObjectivePathProps) {
  if (!objective.isVisible || waypoints.length < 2) return null;

  const pathD = buildSinuousPath(waypoints);
  const color = objective.color;
  const steps = objective.path?.steps ?? [];

  return (
    <g>
      {/* Dotted path — no re-animation on drag */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray="8 6"
        strokeOpacity={0.7}
      />

      {/* Step nodes (skip index 0 = startPoint attached to last event) */}
      {waypoints.slice(1).map((pt, i) => {
        const step = steps[i];
        if (!step) return null;

        const nodeKey = `${objective.id}_${i + 1}`;
        const isLast = i === waypoints.length - 2;
        const isDragging = draggingKey === nodeKey;
        const nodeRadius = isLast ? 13 : 9;
        const labelY = i % 2 === 0 ? pt.y - 36 : pt.y + 36;
        const labelAnchorY = i % 2 === 0 ? -1 : 1;

        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.8 + i * 0.15, type: 'spring' }}
          >
            {/* Glow for final node */}
            {isLast && (
              <motion.circle
                cx={pt.x} cy={pt.y} r={22}
                fill={color} opacity={0.12}
                animate={{ r: [22, 28, 22] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            )}

            {/* Drag highlight ring */}
            {isDragging && (
              <circle
                cx={pt.x} cy={pt.y} r={nodeRadius + 8}
                fill="none" stroke={color}
                strokeWidth={1.5} strokeOpacity={0.5}
                strokeDasharray="4 3"
              />
            )}

            {/* Hit area — larger invisible circle for easy grab */}
            <circle
              cx={pt.x} cy={pt.y} r={nodeRadius + 10}
              fill="transparent"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              onMouseDown={onNodeDragStart(nodeKey, pt)}
            />

            {/* Visible node circle */}
            <circle
              cx={pt.x} cy={pt.y} r={nodeRadius}
              fill={isLast ? color : '#111827'}
              stroke={color} strokeWidth={2}
              style={{ pointerEvents: 'none' }}
            />

            {/* Icon */}
            <text
              x={pt.x} y={pt.y + 4}
              textAnchor="middle"
              fontSize={isLast ? 10 : 8}
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {step.type === 'formation' ? '🎓' : '💼'}
            </text>

            {/* Connector to label */}
            <line
              x1={pt.x}
              y1={pt.y + (labelAnchorY < 0 ? -nodeRadius : nodeRadius)}
              x2={pt.x}
              y2={labelY + (labelAnchorY < 0 ? 16 : -4)}
              stroke={color} strokeWidth={1} strokeOpacity={0.3} strokeDasharray="2 2"
              style={{ pointerEvents: 'none' }}
            />

            {/* Label box */}
            <rect
              x={pt.x - 62}
              y={labelY + (labelAnchorY < 0 ? -38 : 0)}
              width={124} height={38} rx={6}
              fill="#0f172a" stroke={color} strokeWidth={0.8} strokeOpacity={0.6}
              style={{ pointerEvents: 'none' }}
            />

            {/* Title */}
            <text
              x={pt.x}
              y={labelY + (labelAnchorY < 0 ? -22 : 14)}
              textAnchor="middle" fill={color}
              fontSize={9} fontWeight="bold" fontFamily="'Inter', sans-serif"
              style={{ pointerEvents: 'none' }}
            >
              {step.title.length > 16 ? step.title.slice(0, 15) + '…' : step.title}
            </text>

            {/* Salary or cost */}
            <text
              x={pt.x}
              y={labelY + (labelAnchorY < 0 ? -10 : 26)}
              textAnchor="middle" fill="#64748b"
              fontSize={8} fontFamily="monospace"
              style={{ pointerEvents: 'none' }}
            >
              {step.salary_min
                ? `${Math.round(step.salary_min / 1000)}k–${Math.round((step.salary_max ?? step.salary_min) / 1000)}k€`
                : step.cost
                ? `~${Math.round(step.cost / 1000)}k€ formation`
                : `~${step.duration_months}mois`}
            </text>

            {/* Year estimate */}
            {step.year_estimate && (
              <text
                x={pt.x}
                y={labelY + (labelAnchorY < 0 ? 2 : 38)}
                textAnchor="middle" fill="#475569"
                fontSize={7} fontFamily="monospace"
                style={{ pointerEvents: 'none' }}
              >
                ~{step.year_estimate}
              </text>
            )}
          </motion.g>
        );
      })}
    </g>
  );
}
