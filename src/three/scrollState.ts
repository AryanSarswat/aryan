/**
 * Mutable, module-level scroll/interaction store.
 *
 * The WebGL set-piece scenes read these values inside `useFrame` every tick,
 * while the HTML/GSAP layer writes them. Keeping the channel outside React means
 * scroll and pointer movement never trigger re-renders — essential for 60fps.
 */
export type SetPiece = "hero" | "work" | "career";

export interface ScrollState {
  /** Which 3D set piece currently owns the screen, or null in calm sections. */
  active: SetPiece | null;
  /** Hero handoff: 0 at the top of the page → 1 once scrolled fully past hero. */
  heroExit: number;
  /** Horizontal progress through the Work gallery, 0 → 1. */
  workPan: number;
  /** Vertical progress travelling the Career timeline, 0 → 1. */
  careerTravel: number;
  /** Active role index derived from careerTravel. */
  careerIndex: number;
  /** Normalised cursor position, -1 → 1 on each axis. */
  mouseX: number;
  mouseY: number;
  /** Honour the user's reduced-motion preference. */
  reduced: boolean;
  /** Roughly how wide the viewport is, so scenes can scale density. */
  isMobile: boolean;
}

export const scrollState: ScrollState = {
  active: null,
  heroExit: 0,
  workPan: 0,
  careerTravel: 0,
  careerIndex: 0,
  mouseX: 0,
  mouseY: 0,
  reduced: false,
  isMobile: false,
};
