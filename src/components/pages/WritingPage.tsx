import { useEffect } from "react";
import { musings } from "../../hooks/useMusings";
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

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export default function WritingPage() {
  useRevealOnMount();
  const [featured, ...rest] = musings;

  return (
    <div className="page-frame page-enter">
      <section style={{ padding: "8rem 2rem 4rem", position: "relative" }}>
        <div style={{ position: "absolute", top: "12%", right: "6%", pointerEvents: "none" }}>
          <Ornament size={120} opacity={0.18} />
        </div>

        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", position: "relative" }}>
          {/* Section label */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}>
            <span className="numeral" style={{ fontSize: "14px" }}>§ 02</span>
            <span className="eyebrow eyebrow-accent">Writing</span>
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
              <span className="mask-reveal" style={{ display: "block" }}>Musings.</span>
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
              Notes on AI, building, and whatever else has been rattling around. Updated when
              something is worth saying.
            </p>
          </div>

          {/* Featured article */}
          {featured && (
            <a
              href={`#/writing/${featured.slug}`}
              className="featured-article"
              style={{ display: "block", marginTop: "4rem", marginBottom: "5rem", textDecoration: "none", color: "inherit" }}
            >
              <div
                className="featured-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.4fr",
                  gap: "3rem",
                  alignItems: "stretch",
                  padding: "2.5rem 0",
                  borderTop: "1px solid var(--line-strong)",
                  borderBottom: "1px solid var(--line)",
                  animation: "fadeUp 0.8s 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) backwards",
                }}
              >
                {/* Left: visual card */}
                <div
                  style={{
                    minHeight: "300px",
                    background: "linear-gradient(135deg, rgba(168,85,247,0.16), rgba(168,85,247,0.02))",
                    border: "1px solid var(--line)",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    fontFamily: "var(--font-mono)",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "2px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span className="eyebrow eyebrow-accent">Featured essay</span>
                    <span className="numeral" style={{ fontSize: "2.5rem", lineHeight: 1, opacity: 0.4 }}>I</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.9 }}>
                    {featured.tags.map((t) => (
                      <div key={t}>// {t.toLowerCase()}</div>
                    ))}
                  </div>
                  <svg
                    viewBox="0 0 200 120"
                    style={{
                      position: "absolute",
                      right: -20,
                      top: "40%",
                      width: "180px",
                      opacity: 0.35,
                      pointerEvents: "none",
                    }}
                  >
                    <g fill="none" stroke="var(--accent)" strokeWidth="0.5">
                      <circle cx="40" cy="60" r="22" />
                      <circle cx="100" cy="60" r="22" />
                      <circle cx="160" cy="60" r="22" />
                      <line x1="62" y1="60" x2="78" y2="60" />
                      <line x1="122" y1="60" x2="138" y2="60" />
                      <text x="40" y="64" fill="var(--accent)" fontSize="6" textAnchor="middle" fontFamily="monospace">A</text>
                      <text x="100" y="64" fill="var(--accent)" fontSize="6" textAnchor="middle" fontFamily="monospace">B</text>
                      <text x="160" y="64" fill="var(--accent)" fontSize="6" textAnchor="middle" fontFamily="monospace">C</text>
                    </g>
                  </svg>
                </div>

                {/* Right: meta */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      marginBottom: "1.25rem",
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      color: "var(--muted-2)",
                    }}
                  >
                    <span>{shortDate(featured.date)}</span>
                    <span>·</span>
                    <span>{featured.readTime}</span>
                  </div>
                  <h3
                    className="featured-title"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(1.7rem, 3.6vw, 2.6rem)",
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                      marginBottom: "1.25rem",
                    }}
                  >
                    {featured.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      color: "var(--muted)",
                      fontSize: "17px",
                      lineHeight: 1.6,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {featured.description}
                  </p>
                  <span
                    className="arrow-link"
                    style={{ color: "var(--accent)", fontSize: "13px", fontWeight: 600 }}
                  >
                    Read essay <span className="arrow">→</span>
                  </span>
                </div>
              </div>
            </a>
          )}

          {/* Earlier essays */}
          {rest.length > 0 && (
            <div className="reveal">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <span className="eyebrow">Earlier essays</span>
                <span style={{ flex: 1, height: "1px", background: "var(--line)", display: "block" }} />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--muted-2)",
                  }}
                >
                  {String(rest.length).padStart(2, "0")}
                </span>
              </div>
              <div>
                {rest.map((m, i) => (
                  <a
                    key={m.slug}
                    href={`#/writing/${m.slug}`}
                    className="post-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 130px 1fr 100px",
                      gap: "1.5rem",
                      alignItems: "baseline",
                      padding: "1.75rem 1rem",
                      borderTop: "1px solid var(--line)",
                      transition: "all 0.3s",
                      margin: "0 -1rem",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <span className="numeral" style={{ fontSize: "1.4rem" }}>
                      {ROMAN[i + 1] || String(i + 2).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        color: "var(--muted-2)",
                      }}
                    >
                      {shortDate(m.date)}
                    </span>
                    <div>
                      <h4
                        className="post-title"
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "1.5rem",
                          fontWeight: 500,
                          letterSpacing: "-0.012em",
                          lineHeight: 1.25,
                          marginBottom: "0.4rem",
                        }}
                      >
                        {m.title}
                      </h4>
                      <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.55, maxWidth: "640px" }}>
                        {m.description}
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        color: "var(--muted-2)",
                        textAlign: "right",
                      }}
                    >
                      {m.readTime}
                    </span>
                  </a>
                ))}
                <div style={{ borderTop: "1px solid var(--line)" }} />
              </div>
            </div>
          )}
        </div>
      </section>
      <PageFooterNav currentId="writing" />
      <style>{`
        .featured-article:hover .featured-title { color: var(--accent); }
        .featured-title { transition: color 0.3s; }
        .post-row:hover { background: rgba(168,85,247,0.04); }
        .post-row:hover .post-title { color: var(--accent); }
        .post-title { transition: color 0.2s; }
        @media (max-width: 720px) {
          .featured-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .post-row { grid-template-columns: 40px 1fr !important; gap: 0.75rem !important; }
          .post-row > span:nth-child(2), .post-row > span:nth-child(4) { display: none; }
        }
      `}</style>
    </div>
  );
}
