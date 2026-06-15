import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "../../data/experiences";
import { scrollState, requestBurst } from "../../three/scrollState";

const TRACK_H = 6.5; // matches the Career form height in NodeNetwork

export default function Career() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const n = experiences.length;

    if (scrollState.reduced) {
      if (railRef.current) railRef.current.style.transform = "scaleY(1)";
      itemsRef.current.forEach((el) => el?.classList.add("lit"));
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        railRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            end: "bottom 75%",
            scrub: true,
          },
        }
      );

      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        const fire = () => {
          el.classList.add("lit");
          const p = n > 1 ? i / (n - 1) : 0.5;
          requestBurst({ x: 0, y: (p - 0.5) * TRACK_H, z: 0 });
        };
        ScrollTrigger.create({
          trigger: el,
          start: "top 68%",
          onEnter: fire,
          onEnterBack: fire,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="career" data-journey ref={sectionRef} className="section">
      <div className="section-inner">
        <div className="eyebrow-row reveal">
          <span className="section-index">04</span>
          <span className="hud-label hud-accent">Career</span>
          <span className="line" />
        </div>

        <h2
          className="display-xl reveal"
          style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", marginBottom: "0.85rem" }}
        >
          Trajectory.
        </h2>
        <p className="reveal" style={{ color: "var(--muted)", maxWidth: "520px", marginBottom: "1rem" }}>
          Industry, research, and academia — the path so far.
        </p>

        <div className="career-grid">
          <div className="timeline">
            <div className="timeline-rail">
              <span ref={railRef} style={{ height: "100%", display: "block" }} />
            </div>

            {experiences.map((exp, i) => (
              <div
                key={`${exp.year}-${exp.title}`}
                className="milestone reveal"
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
              >
                <span className="milestone-node" />
                <div className="milestone-card">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span className="section-index">{exp.year}</span>
                    <span className="tag">{exp.category}</span>
                    {exp.isCurrent && (
                      <span className="hud-label hud-accent" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
                        Now
                      </span>
                    )}
                  </div>
                  <h3
                    className="font-display"
                    style={{ fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.15 }}
                  >
                    {exp.title}
                  </h3>
                  <div className="hud-label" style={{ margin: "0.4rem 0 0.85rem", color: "var(--muted)" }}>
                    {exp.company}
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.6 }}>
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div aria-hidden="true" />
        </div>
      </div>

      <style>{`
        .career-grid { display: grid; grid-template-columns: minmax(0, 640px) 1fr; gap: 2rem; margin-top: 2.5rem; }
        @media (max-width: 860px) { .career-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
