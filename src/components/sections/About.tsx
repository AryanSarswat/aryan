import { RESUME_URL } from "../../data/config";
import { techStack } from "../../data/techStack";

const PHOTO = `${import.meta.env.BASE_URL}photo.jpg`;
const STACK = techStack.map((t) => t.name).join("  /  ");

const stats = [
  { label: "Based in", value: "Seattle", sub: "WA · USA" },
  { label: "Previously", value: "Atlanta", sub: "GA · USA" },
  { label: "Origin", value: "Singapore", sub: "& India" },
  { label: "Currently", value: "Children of Time", sub: "Reading · Sci-Fi" },
];

export default function About() {
  return (
    <section id="about" data-journey className="section">
      <div className="section-inner">
        {/* Header */}
        <div className="eyebrow-row reveal">
          <span className="section-index">01</span>
          <span className="hud-label hud-accent">About</span>
          <span className="line" />
        </div>

        <div className="about-grid">
          {/* Left — bio, balancing the 3D object on the right */}
          <div>
            <h2
              className="display-xl reveal"
              style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", marginBottom: "2rem" }}
            >
              Turning research into{" "}
              <span className="text-accent-glow">things people use.</span>
            </h2>

            {/* ID badge */}
            <div
              className="reveal bracket-frame"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.1rem",
                padding: "0.9rem",
                border: "1px solid var(--line)",
                marginBottom: "2rem",
                width: "fit-content",
                background: "var(--panel)",
              }}
            >
              <img
                src={PHOTO}
                alt="Aryan Sarswat"
                width={68}
                height={84}
                style={{
                  width: 68,
                  height: 84,
                  objectFit: "cover",
                  filter: "grayscale(0.6) contrast(1.05)",
                  border: "1px solid var(--line-strong)",
                }}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>
                  Aryan Sarswat
                </div>
                <div className="hud-label" style={{ marginTop: 4 }}>
                  ML Scientist II · Expedia
                </div>
                <div className="hud-label hud-accent" style={{ marginTop: 6, letterSpacing: "0.2em" }}>
                  ID — AS·2026
                </div>
              </div>
            </div>

            <div
              className="reveal"
              style={{
                fontSize: "clamp(1.05rem, 1.5vw, 1.22rem)",
                lineHeight: 1.7,
                color: "rgba(232,237,242,0.82)",
                maxWidth: "560px",
              }}
            >
              <p style={{ marginBottom: "1.2em" }}>
                I'm a{" "}
                <strong style={{ color: "var(--fg)", fontWeight: 600 }}>
                  Machine Learning Scientist II
                </strong>{" "}
                at Expedia Group, working on the agentic systems that shape how millions of people
                plan travel.
              </p>
              <p style={{ marginBottom: "1.2em", color: "var(--muted)" }}>
                My focus is the gap between research and product — turning state-of-the-art ideas
                into things real people actually use. Before this, deepfake detection at A*STAR
                and a CS master's at Georgia Tech.
              </p>
              <p style={{ color: "var(--muted)" }}>
                Outside work I lift, climb, read sci-fi, and play too much chess. This site is part
                portfolio, part notebook.
              </p>
            </div>

            <div
              className="reveal"
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.25rem" }}
            >
              <a className="btn" href={RESUME_URL} target="_blank" rel="noopener noreferrer" download>
                Download résumé
              </a>
              <a
                className="btn-ghost group-arrow"
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                View PDF <span className="arrow">↗</span>
              </a>
            </div>
          </div>

          {/* Right — reserved for the 3D anchor; vertical telemetry strip for texture */}
          <div className="about-right" aria-hidden="true">
            <span className="about-telemetry">// COGNITION&nbsp;ENGINE — ONLINE</span>
          </div>
        </div>

        {/* Tech stack marquee */}
        <div className="reveal" style={{ marginTop: "clamp(2.5rem, 6vh, 4rem)" }}>
          <div className="eyebrow-row" style={{ marginBottom: "1rem" }}>
            <span className="hud-label">Stack</span>
            <span className="line" />
            <span className="hud-label">{techStack.length} tools</span>
          </div>
          <div className="marquee">
            <div className="marquee-track" style={{ animationDuration: "55s", color: "var(--muted)" }}>
              {Array.from({ length: 2 }).map((_, k) => (
                <span key={k}>{STACK}&nbsp;&nbsp;/&nbsp;&nbsp;</span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div
          className="stats-grid reveal"
          style={{
            marginTop: "clamp(3rem, 7vh, 5rem)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            borderTop: "1px solid var(--line-strong)",
            borderBottom: "1px solid var(--line-strong)",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "1.6rem 1.25rem",
                borderRight: i < 3 ? "1px solid var(--line)" : "none",
              }}
            >
              <div className="hud-label" style={{ marginBottom: "0.55rem" }}>
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.05rem, 1.6vw, 1.4rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--faint)", marginTop: "0.3rem" }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 3rem;
          align-items: start;
        }
        .about-right {
          position: relative;
          min-height: 320px;
          display: flex;
          justify-content: flex-end;
        }
        .about-telemetry {
          writing-mode: vertical-rl;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--faint);
          opacity: 0.6;
        }
        @media (max-width: 860px) {
          .about-grid { grid-template-columns: 1fr; }
          .about-right { display: none; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid > div:nth-child(2) { border-right: none !important; }
          .stats-grid > div:nth-child(1), .stats-grid > div:nth-child(2) { border-bottom: 1px solid var(--line); }
        }
      `}</style>
    </section>
  );
}
