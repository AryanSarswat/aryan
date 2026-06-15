import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { projects } from "../../data/projects";
import { scrollState } from "../../three/scrollState";

function Cards() {
  return (
    <>
      {/* Intro panel doubles as the section header and pans in first */}
      <div
        className="work-card"
        style={{
          width: "clamp(260px, 70vw, 360px)",
          background: "linear-gradient(135deg, rgba(34,211,238,0.08), rgba(34,211,238,0.01))",
          justifyContent: "space-between",
          padding: "2rem",
        }}
      >
        <div>
          <div className="eyebrow-row" style={{ marginBottom: "1.25rem" }}>
            <span className="section-index">03</span>
            <span className="hud-label hud-accent">Work</span>
          </div>
          <h2 className="display-xl" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            Selected<br />Work.
          </h2>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6 }}>
          Six projects across robotics, LLM security, RL, and applied vision.
        </p>
        <div className="hud-label group-arrow" style={{ display: "flex", gap: "0.6rem" }}>
          Scroll to traverse <span className="arrow">→</span>
        </div>
      </div>

      {projects.map((p, i) => (
        <article className="work-card" key={p.id}>
          <div className="work-card-media">
            {p.image && <img src={p.image} alt={p.title} loading="lazy" />}
            <span
              className="hud-label"
              style={{ position: "absolute", top: 12, left: 14, color: "#cde9f2" }}
            >
              {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>
          <div className="work-card-body">
            <div className="hud-label hud-accent" style={{ marginBottom: "0.75rem" }}>
              {p.category}
            </div>
            <h3
              className="font-display"
              style={{
                fontSize: "1.4rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                lineHeight: 1.12,
                marginBottom: "0.75rem",
              }}
            >
              {p.title}
            </h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, flex: 1 }}>
              {p.description}
            </p>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", margin: "1rem 0" }}>
              {p.techStack.slice(0, 4).map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost group-arrow"
                style={{ color: "var(--accent)" }}
              >
                View project <span className="arrow">↗</span>
              </a>
            )}
          </div>
        </article>
      ))}
    </>
  );
}

export default function Work() {
  const [native] = useState(() => scrollState.reduced || scrollState.isMobile);
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  // ── Pinned horizontal scroll (desktop, motion allowed) ──
  useEffect(() => {
    if (native) return;
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;

    const setHeight = () => {
      const distance = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${window.innerHeight + distance}px`;
      return distance;
    };

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -setHeight(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          pin: pin,
          pinSpacing: false,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: setHeight,
          onUpdate: (self) => {
            scrollState.workPan = self.progress;
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
    }, section);

    return () => {
      ctx.revert();
      section.style.height = "";
    };
  }, [native]);

  // ── Native horizontal swipe (touch / reduced motion) ──
  const onNativeScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    scrollState.workPan = p;
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
  };

  if (native) {
    return (
      <section id="work" data-journey className="section" style={{ paddingBottom: "3rem" }}>
        <div
          ref={trackRef}
          onScroll={onNativeScroll}
          style={{
            display: "flex",
            gap: "1.25rem",
            overflowX: "auto",
            scrollSnapType: "x proximity",
            padding: "1rem 0 1.5rem",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Cards />
        </div>
        <div
          className="work-progress"
          style={{ position: "relative", left: 0, right: 0, bottom: 0, marginTop: "1rem" }}
        >
          <span ref={barRef} />
        </div>
      </section>
    );
  }

  return (
    <section id="work" data-journey ref={sectionRef} style={{ padding: 0 }}>
      <div ref={pinRef} className="work-pin">
        <div className="work-viewport">
          <div ref={trackRef} className="work-track">
            <Cards />
          </div>
          <div className="work-progress">
            <span ref={barRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
