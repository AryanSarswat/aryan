import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data/projects";
import { scrollState } from "../../three/scrollState";
import { clamp } from "../../three/mathUtils";

const N = projects.length;

/** Mobile / reduced-motion fallback: a native horizontal swipe gallery. */
function NativeGallery() {
  const barRef = useRef<HTMLSpanElement>(null);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
  };

  return (
    <section id="work" data-journey className="section" style={{ paddingBottom: "3rem" }}>
      <div className="section-inner" style={{ marginBottom: "1.5rem" }}>
        <div className="eyebrow-row">
          <span className="section-index">03</span>
          <span className="hud-label hud-accent">Work</span>
          <span className="line" />
        </div>
        <h2 className="display-xl" style={{ fontSize: "clamp(2rem, 7vw, 3rem)" }}>
          Selected work.
        </h2>
      </div>

      <div className="work-swipe" onScroll={onScroll}>
        {projects.map((p, i) => (
          <article className="work-card" key={p.id}>
            <div className="work-card-media">
              {p.image && <img src={p.image} alt={p.title} loading="lazy" />}
              <span
                className="hud-label"
                style={{ position: "absolute", top: 12, left: 14, color: "#cde9f2" }}
              >
                {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
              </span>
            </div>
            <div className="work-card-body">
              <div className="hud-label hud-accent" style={{ marginBottom: "0.75rem" }}>
                {p.category}
              </div>
              <h3
                className="font-display"
                style={{ fontSize: "1.4rem", fontWeight: 700, lineHeight: 1.12, marginBottom: "0.75rem" }}
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
      </div>

      <div className="work-progress" style={{ position: "relative", margin: "1rem auto 0", maxWidth: "var(--maxw)" }}>
        <span ref={barRef} />
      </div>
    </section>
  );
}

/**
 * Desktop set piece: the section pins while scroll is mapped to `workPan`,
 * driving the 3D card gallery in the canvas behind. A synced HUD panel shows
 * the active project's details (crisp HTML — only the visuals are 3D).
 */
function PinnedStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const lastIdx = useRef(0);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const setHeight = () => {
      const distance = window.innerHeight * N * 0.85;
      section.style.height = `${window.innerHeight + distance}px`;
    };
    setHeight();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin,
        pinSpacing: false,
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: setHeight,
        onUpdate: (self) => {
          scrollState.workPan = self.progress;
          if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          const i = clamp(Math.round(self.progress * (N - 1)), 0, N - 1);
          if (i !== lastIdx.current) {
            lastIdx.current = i;
            setIdx(i);
          }
        },
      });
    }, section);

    return () => {
      ctx.revert();
      section.style.height = "";
    };
  }, []);

  const p = projects[idx];

  return (
    <section id="work" data-journey ref={sectionRef} style={{ padding: 0 }}>
      <div ref={pinRef} className="work-stage">
        <div className="work-stage-inner">
          <div className="eyebrow-row">
            <span className="section-index">03</span>
            <span className="hud-label hud-accent">Work</span>
          </div>

          <div className="setpiece-meta" key={p.id}>
            <div className="hud-label hud-accent" style={{ marginBottom: "0.6rem" }}>
              {String(idx + 1).padStart(2, "0")} / {String(N).padStart(2, "0")} · {p.category}
            </div>
            <h3 className="font-display setpiece-meta-title">{p.title}</h3>
            <p className="setpiece-meta-desc">{p.description}</p>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", margin: "0.9rem 0" }}>
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

          <div className="work-stage-foot">
            <div className="hud-label group-arrow" style={{ display: "flex", gap: "0.6rem" }}>
              Scroll to traverse the gallery <span className="arrow">→</span>
            </div>
            <div className="work-progress">
              <span ref={barRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Work() {
  const [native] = useState(() => scrollState.reduced || scrollState.isMobile);
  return native ? <NativeGallery /> : <PinnedStage />;
}
