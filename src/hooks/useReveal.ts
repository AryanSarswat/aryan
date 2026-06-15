import { useEffect } from "react";

/**
 * Adds the `in` class to every `.reveal` element once it scrolls into view,
 * driving the CSS fade-up transitions. Runs once after mount.
 */
export function useReveal(): void {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
