import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "./scrollState";
import { clamp } from "./mathUtils";
import { MOBILE_BREAKPOINT } from "../data/config";

/**
 * Headless bridge between the DOM scroll/pointer state and the WebGL scene.
 *
 * - Derives a continuous `morph` value (0→5) from the on-screen centre of each
 *   `[data-journey]` section, so the 3D transitions stay locked to the content
 *   even through the pinned Work section (whose pin-spacer inflates layout).
 * - Mirrors scroll progress and normalised cursor position into `scrollState`.
 *
 * All writes go to a plain object read inside `useFrame`; nothing re-renders.
 */
export default function JourneyController() {
  useEffect(() => {
    let centers: number[] = [];
    let docHeight = 1;
    let raf = 0;
    let alive = true;

    const recalc = () => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-journey]")
      );
      centers = els.map((el) => el.offsetTop + el.offsetHeight / 2);
      docHeight = document.documentElement.scrollHeight;
    };

    const tick = () => {
      if (!alive) return;
      const vh = window.innerHeight;
      const mid = window.scrollY + vh / 2;
      const last = centers.length - 1;
      if (last >= 1) {
        let morph = 0;
        if (mid <= centers[0]) morph = 0;
        else if (mid >= centers[last]) morph = last;
        else {
          for (let i = 0; i < last; i++) {
            if (mid < centers[i + 1]) {
              morph = i + (mid - centers[i]) / (centers[i + 1] - centers[i]);
              break;
            }
          }
        }
        scrollState.morph = morph;
      }
      scrollState.progress = clamp(
        window.scrollY / Math.max(1, docHeight - vh),
        0,
        1
      );
      raf = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      scrollState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => (scrollState.reduced = motionQuery.matches);
    const onResize = () => {
      scrollState.isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      recalc();
    };

    onMotion();
    onResize();
    recalc();

    // Layout settles after fonts/images load and after GSAP builds its pins.
    const settle = setTimeout(() => {
      ScrollTrigger.refresh();
      recalc();
    }, 350);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);
    motionQuery.addEventListener("change", onMotion);
    ScrollTrigger.addEventListener("refresh", recalc);
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", onMotion);
      ScrollTrigger.removeEventListener("refresh", recalc);
    };
  }, []);

  return null;
}
