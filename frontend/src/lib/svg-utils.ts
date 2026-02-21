export interface Point {
  x: number;
  y: number;
}

/**
 * Generates a sinuous SVG path string through an array of points.
 * Uses cubic bezier curves for smooth, organic-looking path.
 */
export function buildSinuousPath(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const dx = curr.x - prev.x;

    // Control points for smooth cubic bezier
    const cp1x = prev.x + dx * 0.5;
    const cp1y = prev.y;
    const cp2x = curr.x - dx * 0.5;
    const cp2y = curr.y;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }

  return path;
}

/**
 * Calculates waypoints for career events on a sinuous horizontal road.
 * Events alternate between top and bottom lanes to create a winding effect.
 */
export function computeEventWaypoints(
  eventCount: number,
  canvasWidth: number,
  canvasHeight: number,
  paddingX = 80,
  amplitude = 80
): Point[] {
  if (eventCount === 0) return [];

  const usableWidth = canvasWidth - paddingX * 2;
  const centerY = canvasHeight / 2;
  const points: Point[] = [];

  for (let i = 0; i < eventCount; i++) {
    const t = eventCount === 1 ? 0.5 : i / (eventCount - 1);
    const x = paddingX + t * usableWidth;

    // Sinusoidal vertical displacement
    const phase = (i / Math.max(eventCount - 1, 1)) * Math.PI * 2.5;
    const y = centerY + Math.sin(phase) * amplitude;

    points.push({ x, y });
  }

  return points;
}

/**
 * Computes waypoints for an objective path branching from the last event.
 * Steps go rightward with alternating vertical offsets.
 */
export function computeObjectiveWaypoints(
  startPoint: Point,
  stepCount: number,
  canvasWidth: number,
  canvasHeight: number,
  objectiveIndex: number,
  paddingX = 80,
  stepSpacing = 160
): Point[] {
  if (stepCount === 0) return [startPoint];

  const centerY = canvasHeight / 2;
  const branchOffset = (objectiveIndex % 3 - 1) * 70; // -70, 0, or +70
  const points: Point[] = [startPoint];

  for (let i = 1; i <= stepCount; i++) {
    const x = Math.min(startPoint.x + i * stepSpacing, canvasWidth - paddingX / 2);
    const phase = (i / (stepCount + 1)) * Math.PI * 1.5 + objectiveIndex * 1.2;
    const y = centerY + branchOffset + Math.sin(phase) * 60;
    points.push({ x, y });
  }

  return points;
}

/** Returns the total approximate length of an SVG path for dash animations */
export function approximatePathLength(points: Point[]): number {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    len += Math.sqrt(dx * dx + dy * dy) * 1.2; // 1.2 factor for bezier curves
  }
  return len;
}
