'use client';

import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCareerStore } from '@/store/career-store';
import {
  buildSinuousPath,
  computeEventWaypoints,
  computeObjectiveWaypoints,
  Point,
} from '@/lib/svg-utils';
import EventNode from './EventNode';
import ObjectivePath from './ObjectivePath';

const CANVAS_HEIGHT = 340;

type DragTarget =
  | { kind: 'event'; id: string }
  | { kind: 'obj'; key: string };

interface DragState {
  target: DragTarget;
  startClient: Point;
  startSvgPos: Point;
}

export default function PathCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(1000);
  const { events, objectives } = useCareerStore();

  // Position overrides per node
  const [eventOverrides, setEventOverrides] = useState<Record<string, Point>>({});
  const [objOverrides, setObjOverrides] = useState<Record<string, Point>>({});
  const [dragging, setDragging] = useState<DragState | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setCanvasWidth(containerRef.current.clientWidth);
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseEventPoints = useMemo(
    () => computeEventWaypoints(Math.max(events.length, 1), canvasWidth, CANVAS_HEIGHT),
    [events.length, canvasWidth]
  );

  const effectiveEventPoints = useMemo(
    () => events.map((ev, i) => eventOverrides[ev.id] ?? baseEventPoints[i]),
    [events, baseEventPoints, eventOverrides]
  );

  const mainPathD = useMemo(
    () => (events.length > 0 ? buildSinuousPath(effectiveEventPoints) : ''),
    [effectiveEventPoints, events.length]
  );

  const baseObjWaypoints = useMemo(() => {
    const currentPoint: Point = effectiveEventPoints[effectiveEventPoints.length - 1] ?? {
      x: 80,
      y: CANVAS_HEIGHT / 2,
    };
    return objectives.map((obj, i) => {
      const stepCount = obj.path?.steps.length ?? 3;
      return computeObjectiveWaypoints(currentPoint, stepCount, canvasWidth, CANVAS_HEIGHT, i);
    });
  }, [objectives, effectiveEventPoints, canvasWidth]);

  // Apply per-step overrides to objective waypoints (skip index 0 = anchor point)
  const effectiveObjWaypoints = useMemo(
    () =>
      objectives.map((obj, i) =>
        (baseObjWaypoints[i] ?? []).map((pt, j) => {
          if (j === 0) return pt; // anchor stays connected to last event
          return objOverrides[`${obj.id}_${j}`] ?? pt;
        })
      ),
    [objectives, baseObjWaypoints, objOverrides]
  );

  const clientToSvg = useCallback((clientX: number, clientY: number): Point => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: clientX, y: clientY };
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const startDrag = useCallback(
    (target: DragTarget, startSvgPos: Point) => (e: React.MouseEvent) => {
      e.preventDefault();
      setDragging({ target, startClient: { x: e.clientX, y: e.clientY }, startSvgPos });
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!dragging) return;
      const cur = clientToSvg(e.clientX, e.clientY);
      const start = clientToSvg(dragging.startClient.x, dragging.startClient.y);
      const newPos: Point = {
        x: dragging.startSvgPos.x + (cur.x - start.x),
        y: dragging.startSvgPos.y + (cur.y - start.y),
      };

      const { target } = dragging;
      if (target.kind === 'event') {
        setEventOverrides((prev) => ({ ...prev, [target.id]: newPos }));
      } else {
        setObjOverrides((prev) => ({ ...prev, [target.key]: newPos }));
      }
    },
    [dragging, clientToSvg]
  );

  const stopDrag = useCallback(() => setDragging(null), []);

  const draggingEventId =
    dragging?.target.kind === 'event' ? dragging.target.id : null;
  const draggingObjKey =
    dragging?.target.kind === 'obj' ? dragging.target.key : null;

  const maxObjX = effectiveObjWaypoints.flat().reduce((m, p) => Math.max(m, p.x), canvasWidth);
  const svgWidth = Math.max(canvasWidth, maxObjX + 80);
  const isEmpty = events.length === 0;

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <svg
        ref={svgRef}
        width={svgWidth}
        height={CANVAS_HEIGHT}
        className="block"
        style={{
          minWidth: canvasWidth,
          cursor: dragging ? 'grabbing' : 'default',
          userSelect: 'none',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="path-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={i}
            x1={0} y1={(CANVAS_HEIGHT / 5) * i}
            x2={svgWidth} y2={(CANVAS_HEIGHT / 5) * i}
            stroke="#1e293b" strokeWidth={1} strokeOpacity={0.4}
          />
        ))}

        {/* Empty state */}
        {isEmpty && (
          <>
            <motion.path
              d={`M 80 ${CANVAS_HEIGHT / 2} C 200 ${CANVAS_HEIGHT / 2 - 60}, 350 ${CANVAS_HEIGHT / 2 + 60}, 500 ${CANVAS_HEIGHT / 2}`}
              fill="none" stroke="#1e293b" strokeWidth={2} strokeDasharray="8 6"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
            <text
              x={svgWidth / 2} y={CANVAS_HEIGHT / 2 - 24}
              textAnchor="middle" fill="#334155"
              fontSize={13} fontFamily="'Inter', sans-serif"
            >
              Ajoutez un événement pour commencer votre parcours...
            </text>
          </>
        )}

        {/* Objective paths (behind main path) */}
        {objectives.map((obj, i) => (
          <ObjectivePath
            key={obj.id}
            objective={obj}
            waypoints={effectiveObjWaypoints[i] ?? []}
            objectiveIndex={i}
            draggingKey={draggingObjKey}
            onNodeDragStart={(key, pos) => startDrag({ kind: 'obj', key }, pos)}
          />
        ))}

        {/* Main career path */}
        {events.length > 0 && (
          <>
            <path
              d={mainPathD}
              fill="none" stroke="#60a5fa" strokeWidth={6} strokeOpacity={0.12}
              filter="url(#path-glow)"
            />
            <path
              d={mainPathD}
              fill="none" stroke="url(#pathGrad)" strokeWidth={3}
              strokeLinecap="round" strokeLinejoin="round"
            />
          </>
        )}

        {/* Event nodes */}
        {events.map((event, i) => (
          <EventNode
            key={event.id}
            event={event}
            position={effectiveEventPoints[i]}
            index={i}
            isCurrent={i === events.length - 1}
            isDragging={draggingEventId === event.id}
            onDragStart={startDrag({ kind: 'event', id: event.id }, effectiveEventPoints[i])}
          />
        ))}
      </svg>
    </div>
  );
}
