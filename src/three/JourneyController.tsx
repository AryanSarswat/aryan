import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "./scrollState";
import { clamp } from "./mathUtils";
import { experiences } from "../data/experiences";

const CAREER_N = experiences.length;

/**
 * Headless bridge between DOM scroll/pointer state and the WebGL set pieces.
 *
 * Each frame it decides which set piece (if any) owns the screen from the live
 * scroll offset of the section elements, and writes the per-scene progress
 * values into `scrollState`. On mobile or with reduced motion only the Hero
 * scene is ever activated — Work and Career fall back to plain HTML — so the
 * GPU stays idle and the experience stays calm.
 *
 * All writes go to a plain object read inside `useFrame`; nothing re-renders.
 */
export default function JourneyController() {
  useEffect(() => {
    let alive = true;
    let raf = 0;
    let aboutTop = 0;
    let workTop = 0;
    let workH = 0;
    let careerTop = 0;
    let careerH = 0;

    const recalc = () => {
      const byId = (id: string) => document.getElementById(id);
      const vh = window.innerHeight;
      const about = byId("about");
      const work = byId("work");
      const career = byId("career");
      aboutTop = about ? about.offsetTop : vh;
      workTop = work ? work.offsetTop : 0;
      workH = work ? work.offsetHeight : 0;
      careerTop = career ? career.offsetTop : 0;
      careerH = career ? career.offsetHeight : 0;
    };

    const tick = () => {
      if (!alive) return;
      const vh = window.innerHeight;
      const y = window.scrollY;

      // Hero handoff progresses across the first viewport-and-a-half of scroll.
      const heroEnd = Math.max(1, aboutTop - vh * 0.5);
      scrollState.heroExit = clamp(y / heroEnd, 0, 1);

      const simple = scrollState.isMobile || scrollState.reduced;
      let active: typeof scrollState.active = null;

      if (y < heroEnd) {
        active = "hero";
      } else if (!simple) {
        const workStart = workTop - vh * 0.5;
        const workEnd = workTop + workH - vh * 0.5;
        const careerStart = careerTop - vh * 0.5;
        const careerEnd = careerTop + careerH - vh * 0.5;

        if (workH > 0 && y >= workStart && y < workEnd) {
          active = "work";
        } else if (careerH > 0 && y >= careerStart && y < careerEnd) {
          active = "career";
          const travel = clamp((y - careerStart) / Math.max(1, careerH - vh), 0, 1);
          scrollState.careerTravel = travel;
          scrollState.careerIndex = clamp(
            Math.round(travel * (CAREER_N - 1)),
            0,
            CAREER_N - 1
          );
        }
      }

      scrollState.active = active;
      raf = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      scrollState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => (scrollState.reduced = motionQuery.matches);
    const onResize = () => {
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
