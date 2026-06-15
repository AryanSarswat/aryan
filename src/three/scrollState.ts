/**
 * Mutable, module-level scroll/interaction store.
 *
 * The WebGL scene reads these values inside `useFrame` every tick, while the
 * HTML/GSAP layer writes them. Keeping the channel outside React means scroll
 * and pointer movement never trigger re-renders — essential for holding 60fps.
 */
export interface ScrollState {
  /** Journey position as a continuous float across the six sections (0 → 5). */
  morph: number;
  /** Whole-page scroll progress, 0 → 1. */
  progress: number;
  /** Horizontal progress within the pinned Work section, 0 → 1. */
  workPan: number;
  /** Normalised cursor position, -1 → 1 on each axis. */
  mouseX: number;
  mouseY: number;
  /** Writing-section ripple intensity (decays) and its horizontal origin. */
  ripple: number;
  rippleX: number;
  /** Honour the user's reduced-motion preference. */
  reduced: boolean;
  /** Roughly how wide the viewport is, so the scene can scale density. */
  isMobile: boolean;
}

export const scrollState: ScrollState = {
  morph: 0,
  progress: 0,
  workPan: 0,
  mouseX: 0,
  mouseY: 0,
  ripple: 0,
  rippleX: 0,
  reduced: false,
  isMobile: false,
};

/** Local-space positions (relative to the node group) where Career bursts spawn. */
export interface BurstRequest {
  x: number;
  y: number;
  z: number;
}

/** Drained by the particle system each frame — avoids React for transient FX. */
export const burstQueue: BurstRequest[] = [];

export function requestBurst(p: BurstRequest): void {
  burstQueue.push(p);
}
