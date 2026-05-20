import { useEffect, useMemo } from "react";
import { experiences } from "../../data/experiences";
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

export default function CareerPage() {
  useRevealOnMount();

  const sorted = useMemo(() => {
    return [...experiences].sort((a, b) => {
      const ya = a.year.toLowerCase().includes("present") ? 9999 : parseInt(a.year.split(/[-–]/).pop() || "0") || 0;
      const yb = b.year.toLowerCase().includes("present") ? 9999 : parseInt(b.year.split(/[-–]/).pop() || "0") || 0;
      return yb - ya;
    });
  }, []);

  return (
    <div className="page-frame page-enter">
      <section style={{ padding: "8rem 2rem 4rem", position: "relative" }}>
        <div style={{ position: "absolute", top: "14%", right: "6%", pointerEvents: "none" }}>
          <Ornament size={120} opacity={0.16} />
        </div>

        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}>
            <span className="numeral" style={{ fontSize: "14px" }}>§ 04</span>
            <span className="eyebrow eyebrow-accent">Career</span>
          </div>

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
              <span className="mask-reveal" style={{ display: "block" }}>Where I've been.</span>
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
              A trail of where I've been and what I worked on.
            </p>
          </div>

          <div style={{ marginTop: "4rem", position: "relative" }}>
            {/* Timeline spine */}
            <div
              className="career-spine"
              style={{
                position: "absolute",
                left: "170px",
                top: 0,
                bottom: 0,
                width: "1px",
                background: "linear-gradient(to bottom, var(--accent), var(--line) 80%, transparent)",
                opacity: 0.4,
              }}
            />

            {sorted.map((exp, i) => (
              <div
                key={i}
                className="reveal career-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 60px 1fr 200px",
                  gap: "1.5rem",
                  padding: "2rem 0",
                  borderBottom: i === sorted.length - 1 ? "none" : "1px solid var(--line)",
                  alignItems: "baseline",
                  position: "relative",
                  transitionDelay: `${i * 0.04}s`,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    color: exp.isCurrent ? "var(--accent)" : "var(--muted-2)",
                    fontWeight: 500,
                  }}
                >
                  {exp.year}
                </span>

                <div style={{ position: "relative", height: "14px" }}>
                  <div
                    className="timeline-dot"
                    style={{
                      position: "absolute",
                      left: "24px",
                      top: "5px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: exp.isCurrent ? "var(--accent)" : "var(--bg)",
                      border: `1px solid ${exp.isCurrent ? "var(--accent)" : "var(--line-strong)"}`,
                      boxShadow: exp.isCurrent ? "0 0 16px var(--accent)" : "none",
                    }}
                  />
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.5rem",
                      fontWeight: 500,
                      letterSpacing: "-0.012em",
                      marginBottom: "0.35rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {exp.title}
                  </h3>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--muted)",
                      marginBottom: "0.85rem",
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                    }}
                  >
                    at {exp.company}
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.65, maxWidth: "540px" }}>
                    {exp.description}
                  </p>
                </div>

                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--muted-2)",
                    textAlign: "right",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                  }}
                >
                  {exp.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PageFooterNav currentId="career" />
      <style>{`
        @media (max-width: 720px) {
          .career-row { grid-template-columns: 100px 1fr !important; }
          .career-row > div:nth-child(2), .career-row > span:last-child { display: none !important; }
          .career-spine { display: none; }
        }
      `}</style>
    </div>
  );
}
