import { useEffect } from "react";
import Ornament from "../ui/Ornament";
import PageFooterNav from "../layout/PageFooterNav";

function useRevealOnMount() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const stats = [
  { label: "Based in", value: "Seattle", sub: "WA, USA" },
  { label: "Previous", value: "Atlanta", sub: "GA, USA" },
  { label: "Originally from", value: "Singapore", sub: "and India" },
  { label: "Role", value: "ML Scientist", sub: "Expedia Group" },
  { label: "Reading", value: "Children of Time", sub: "Sci-Fi" },
];

export default function AboutPage() {
  useRevealOnMount();

  return (
    <div className="page-frame page-enter">
      <section style={{ padding: "8rem 2rem 4rem", position: "relative" }}>
        <div style={{ position: "absolute", top: "15%", right: "4%", pointerEvents: "none" }}>
          <Ornament size={100} opacity={0.15} />
        </div>

        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", position: "relative" }}>
          {/* Section label */}
          <div
            style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}
          >
            <span className="numeral" style={{ fontSize: "14px" }}>§ 01</span>
            <span className="eyebrow eyebrow-accent">About</span>
          </div>

          {/* Page title */}
          <div style={{ marginBottom: "3rem" }}>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.035em",
                lineHeight: 1.02,
                marginBottom: "1.5rem",
                overflow: "hidden",
                paddingBottom: "0.1em",
              }}
            >
              <span className="mask-reveal" style={{ display: "block" }}>About.</span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: "var(--muted)",
                maxWidth: "640px",
                lineHeight: 1.5,
                animation: "fadeUp 0.9s 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) backwards",
              }}
            >
              The short version, mostly true.
            </p>
          </div>

          {/* Bio grid */}
          <div
            className="about-grid reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "220px 1fr",
              gap: "4rem",
              alignItems: "start",
              marginTop: "4rem",
            }}
          >
            <div>
              <div
                style={{
                  width: "220px",
                  height: "280px",
                  border: "1px solid var(--line-strong)",
                  borderRadius: "2px",
                  overflow: "hidden",
                  position: "relative",
                  background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.02))",
                }}
              >
                <img
                  src="https://aryansarswat.github.io/aryan/photo.jpg"
                  alt="Aryan Sarswat"
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%) contrast(1.05)" }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-2.2rem",
                    left: 0,
                    right: 0,
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: "11px",
                    color: "var(--muted-2)",
                  }}
                >
                  Fig. 01 — The author, undated.
                </div>
              </div>
            </div>

            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.4rem",
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.86)",
                maxWidth: "600px",
              }}
            >
              <p style={{ marginBottom: "1.5em" }}>
                I'm a{" "}
                <strong style={{ color: "var(--fg)", fontWeight: 500 }}>
                  Machine Learning Scientist II
                </strong>{" "}
                at Expedia Group, working on the agentic systems that shape how millions of people
                plan travel.
              </p>
              <p style={{ marginBottom: "1.5em", fontStyle: "italic", color: "var(--muted)" }}>
                I'm interested in the gap between research and product — turning state-of-the-art
                ideas into things real people use.
              </p>
              <p>
                Outside of work I lift, read sci-fi, and play too much chess. This site is partly
                portfolio, partly notebook.
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div
            className="stats-grid reveal"
            style={{
              marginTop: "6rem",
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 0,
              borderTop: "1px solid var(--line-strong)",
              borderBottom: "1px solid var(--line-strong)",
            }}
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="stat-cell"
                style={{
                  padding: "2rem 1.5rem",
                  borderRight: i < 3 ? "1px solid var(--line)" : "none",
                }}
              >
                <div className="eyebrow" style={{ fontSize: "10px", marginBottom: "0.5rem" }}>
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.4rem",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: "12px", color: "var(--muted-2)", marginTop: "0.25rem" }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PageFooterNav currentId="about" />
      <style>{`
        @media (max-width: 720px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid .stat-cell:nth-child(2) { border-right: none !important; }
          .stats-grid .stat-cell:nth-child(odd) { border-right: 1px solid var(--line) !important; }
          .stats-grid .stat-cell:nth-child(1), .stats-grid .stat-cell:nth-child(2) { border-bottom: 1px solid var(--line); }
        }
      `}</style>
    </div>
  );
}
