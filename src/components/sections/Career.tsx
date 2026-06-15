import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "../../data/experiences";
import { scrollState } from "../../three/scrollState";
import { clamp } from "../../three/mathUtils";

const N = experiences.length;

/** Mobile / reduced-motion fallback: a clean vertical HTML timeline. */
function TimelineList() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
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
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", end: "bottom 75%", scrub: true },
        }
      );
      itemsRef.current.forEach((el) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 72%",
          onEnter: () => el.classList.add("lit"),
          onEnterBack: () => el.classList.add("lit"),
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
        <h2 className="display-xl reveal" style={{ fontSize: "clamp(2rem, 7vw, 3rem)", marginBottom: "0.85rem" }}>
          Trajectory.
        </h2>
        <p className="reveal" style={{ color: "var(--muted)", maxWidth: "520px", marginBottom: "1rem" }}>
          Industry, research, and academia — the path so far.
        </p>

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
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                  <span className="section-index">{exp.year}</span>
                  <span className="tag">{exp.category}</span>
                  {exp.isCurrent && <span className="hud-label hud-accent">● Now</span>}
                </div>
                <h3 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 700, lineHeight: 1.15 }}>
                  {exp.title}
                </h3>
                <div className="hud-label" style={{ margin: "0.4rem 0 0.85rem", color: "var(--muted)" }}>
                  {exp.company}
                </div>
                <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.6 }}>{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Desktop set piece: a tall section whose scroll drives `careerTravel` (the 3D
 * camera travels the timeline behind). A sticky HUD panel shows the active role.
 */
function CareerStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const lastIdx = useRef(0);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let alive = true;
    let raf = 0;
    const tick = () => {
      if (!alive) return;
      const i = clamp(Math.round(scrollState.careerIndex), 0, N - 1);
      if (i !== lastIdx.current) {
        lastIdx.current = i;
        setIdx(i);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  const e = experiences[idx];

  return (
    <section
      id="career"
      data-journey
      ref={sectionRef}
      className="career-section"
      style={{ height: `${N * 85}vh` }}
    >
      <div className="career-stage">
        <div className="career-stage-inner">
          <div className="eyebrow-row">
            <span className="section-index">04</span>
            <span className="hud-label hud-accent">Career</span>
          </div>
          <div className="hud-label career-readout">
            {String(idx + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
          </div>

          <div className="setpiece-meta career-meta" key={idx}>
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.6rem" }}>
              <span className="section-index">{e.year}</span>
              <span className="tag">{e.category}</span>
              {e.isCurrent && <span className="hud-label hud-accent">● Now</span>}
            </div>
            <h3 className="font-display setpiece-meta-title">{e.title}</h3>
            <div className="hud-label" style={{ margin: "0.4rem 0 0.85rem", color: "var(--muted)" }}>
              {e.company}
            </div>
            <p className="setpiece-meta-desc">{e.description}</p>
          </div>

          <div className="hud-label group-arrow career-hint" style={{ display: "flex", gap: "0.6rem" }}>
            Scroll to travel the timeline <span className="arrow">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Career() {
  const [native] = useState(() => scrollState.reduced || scrollState.isMobile);
  return native ? <TimelineList /> : <CareerStage />;
}
