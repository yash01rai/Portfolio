export type Platform = 'linkedin' | 'x';
export type Depth = 0 | 1 | 2; // 0 = back, 1 = mid, 2 = front

export interface IconConfig {
  id: string;
  platform: Platform;
  xPct: number;
  yPct: number;
  size: number;
  depth: Depth;
  rotateFrom: number;
  rotateTo: number;
  driftY: number;   // total y movement over scroll (px, negative = up)
  driftX: number;   // total x movement over scroll (px)
  scaleTo: number;  // final scale value (starts at 1.0)
}

// All xPct values are <13 or >85 — keeps icons in gutters away from the 900px center column.
// Left-side icons drift right (+x), right-side icons drift left (-x) for a centripetal swim feel.
export const ICON_POSITIONS: IconConfig[] = [
  // Back tier (small, blurred, slowest, shortest drift)
  { id: 'b1', platform: 'x',        xPct:  6, yPct: 12, size: 28, depth: 0, rotateFrom: -6, rotateTo:  4, driftY: -130, driftX:  35, scaleTo: 0.96 },
  { id: 'b2', platform: 'linkedin', xPct: 92, yPct: 18, size: 32, depth: 0, rotateFrom:  3, rotateTo: -5, driftY: -160, driftX: -45, scaleTo: 1.04 },
  { id: 'b3', platform: 'linkedin', xPct:  4, yPct: 78, size: 30, depth: 0, rotateFrom:  5, rotateTo: -3, driftY: -120, driftX:  40, scaleTo: 1.02 },
  { id: 'b4', platform: 'x',        xPct: 94, yPct: 84, size: 26, depth: 0, rotateFrom: -4, rotateTo:  6, driftY: -150, driftX: -30, scaleTo: 0.94 },

  // Mid tier
  { id: 'm1', platform: 'linkedin', xPct: 12, yPct: 38, size: 44, depth: 1, rotateFrom: -8, rotateTo:  4, driftY: -260, driftX:  70, scaleTo: 1.06 },
  { id: 'm2', platform: 'x',        xPct: 88, yPct: 46, size: 40, depth: 1, rotateFrom:  6, rotateTo: -6, driftY: -300, driftX: -85, scaleTo: 0.94 },
  { id: 'm3', platform: 'x',        xPct:  8, yPct: 62, size: 42, depth: 1, rotateFrom: -3, rotateTo:  7, driftY: -240, driftX:  60, scaleTo: 1.05 },
  { id: 'm4', platform: 'linkedin', xPct: 90, yPct: 68, size: 46, depth: 1, rotateFrom:  4, rotateTo: -8, driftY: -280, driftX: -75, scaleTo: 0.96 },

  // Front tier (largest, sharpest, biggest drift)
  { id: 'f1', platform: 'x',        xPct:  3, yPct: 28, size: 64, depth: 2, rotateFrom: -8, rotateTo:  8, driftY: -420, driftX:  100, scaleTo: 1.08 },
  { id: 'f2', platform: 'linkedin', xPct: 96, yPct: 32, size: 60, depth: 2, rotateFrom:  7, rotateTo: -7, driftY: -460, driftX: -120, scaleTo: 0.92 },
  { id: 'f3', platform: 'linkedin', xPct:  2, yPct: 52, size: 72, depth: 2, rotateFrom: -5, rotateTo:  8, driftY: -400, driftX:   95, scaleTo: 1.07 },
  { id: 'f4', platform: 'x',        xPct: 97, yPct: 58, size: 56, depth: 2, rotateFrom:  8, rotateTo: -4, driftY: -480, driftX: -110, scaleTo: 0.93 },
];

// Mouse parallax max translation (px) per tier
export const TIER_MOUSE_SHIFT: Record<Depth, number> = {
  0: 4,
  1: 8,
  2: 14,
};
