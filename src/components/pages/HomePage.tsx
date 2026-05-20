import { useState, useEffect } from "react";
import Ornament from "../ui/Ornament";

interface Musing {
  slug: string;
  title: string;
  date: string;
  description: string;
}

function parseFrontmatterMeta(raw: string, slug: string): Musing {
  const parts = raw.split("---");
  const fm = parts[1] ?? "";
  const get = (key: string) => {
    const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return m ? m[1].trim() : "";
  };
  return { slug, title: get("title"), date: get("date"), description: get("description") };
}

const rawFiles = import.meta.glob("../../content/musings/*/index.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const musings: Musing[] = Object.entries(rawFiles)
  .map(([path, raw]) => {
    const match = path.match(/\/musings\/([^/]+)\/index\.md$/);
    const slug = match ? match[1] : "";
    return parseFrontmatterMeta(raw, slug);
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const sections = [
  { label: "About", path: "/about", num: "01" },
  { label: "Writing", path: "/writing", num: "02" },
  { label: "Work", path: "/work", num: "03" },
  { label: "Career", path: "/career", num: "04" },
  { label: "Skills", path: "/skills", num: "05" },
  { label: "Contact", path: "/contact", num: "06" },
];

export default function HomePage() {
  const [time, setTime] = useState("");
  const featured = musings[0];

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="page-frame page-enter">
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "8rem 2rem 6rem",
          position: "relative",
        }}
      >
        {/* Floating ornament */}
        <div style={{ position: "absolute", top: "12%", right: "6%", pointerEvents: "none" }}>
          <Ornament size={140} opacity={0.18} />
        </div>

        <div
          style={{
            maxWidth: "var(--maxw)",
            margin: "0 auto",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Status row */}
          <div
            className="fade-up"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "4rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 10px #22c55e",
                  display: "inline-block",
                }}
              />
              <span className="eyebrow">Currently — Expedia Group</span>
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--muted-2)",
              }}
            >
              ATL · {time} <span className="cursor-blink">_</span>
            </span>
          </div>

          {/* Name */}
          <h1
            style={{
              fontSize: "clamp(3.2rem, 11vw, 9rem)",
              fontWeight: 400,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              marginBottom: "2rem",
              fontFamily: "var(--font-serif)",
            }}
          >
            <span className="mask-reveal" style={{ animationDelay: "0.1s", display: "block" }}>
              Aryan
            </span>
            <span
              className="mask-reveal serif-italic"
              style={{
                animationDelay: "0.35s",
                color: "var(--accent)",
                display: "block",
              }}
            >
              Sarswat.
            </span>
          </h1>

          {/* Strap */}
          <p
            className="fade-up"
            style={{
              fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
              color: "var(--muted)",
              maxWidth: "680px",
              lineHeight: 1.5,
              marginBottom: "5rem",
              animationDelay: "0.6s",
            }}
          >
            <span style={{ color: "var(--fg)" }}>Machine Learning Scientist</span> building
            agentic systems —
            <span className="serif-italic" style={{ color: "var(--muted)" }}>
              {" "}writing about what I learn along the way.
            </span>
          </p>

          {/* Latest writing hook */}
          {featured && (
            <div className="fade-up" style={{ animationDelay: "0.8s", marginBottom: "3rem" }}>
              <div
                className="line-grow"
                style={{
                  height: "1px",
                  background: "var(--line-strong)",
                  marginBottom: "1.25rem",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <span className="eyebrow eyebrow-accent">Latest writing</span>
                <a
                  href="#/writing"
                  className="arrow-link"
                  style={{ fontSize: "12px", color: "var(--muted)", textDecoration: "none" }}
                >
                  All posts <span className="arrow">→</span>
                </a>
              </div>
              <a
                href={`#/writing/${featured.slug}`}
                className="hero-feature"
                style={{ display: "block", textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "1.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      color: "var(--muted-2)",
                      flexShrink: 0,
                    }}
                  >
                    {shortDate(featured.date)}
                  </span>
                  <h3
                    className="hero-title"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(1.5rem, 3.2vw, 2.2rem)",
                      fontWeight: 500,
                      letterSpacing: "-0.018em",
                      lineHeight: 1.2,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {featured.title}{" "}
                    <span style={{ color: "var(--accent)" }} className="hover-arrow">
                      →
                    </span>
                  </h3>
                </div>
                <p
                  style={{
                    color: "var(--muted)",
                    marginTop: "0.5rem",
                    maxWidth: "720px",
                    fontSize: "15px",
                    lineHeight: 1.6,
                  }}
                >
                  {featured.description}
                </p>
              </a>
            </div>
          )}

          {/* Section grid */}
          <div className="fade-up" style={{ animationDelay: "1s", marginTop: "5rem" }}>
            <div style={{ height: "1px", background: "var(--line)", marginBottom: "1.5rem" }} />
            <div
              className="section-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.5rem" }}
            >
              {sections.map((s, i) => (
                <a
                  key={s.path}
                  href={`#${s.path}`}
                  className="quick-link"
                  style={{
                    padding: "1.25rem 0.75rem",
                    borderRadius: "4px",
                    border: "1px solid var(--line)",
                    textAlign: "center",
                    transition: "all 0.3s",
                    textDecoration: "none",
                    color: "var(--fg)",
                    animation: `fadeUp 0.6s ${1.1 + i * 0.06}s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: "var(--muted-2)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {s.num}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {s.label}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: 0,
            right: 0,
            overflow: "hidden",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "13px",
            color: "var(--muted-2)",
            opacity: 0.5,
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="marquee-track" style={{ display: "inline-block" }}>
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i}>
                {" "}— LLMs &nbsp;✦&nbsp; agentic systems &nbsp;✦&nbsp; deep learning &nbsp;✦&nbsp;
                reinforcement learning &nbsp;✦&nbsp; computer vision &nbsp;✦&nbsp; robotics
                &nbsp;✦&nbsp; ML security &nbsp;✦&nbsp; building things&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .hero-feature:hover .hero-title { color: var(--accent); }
        .hero-feature .hover-arrow { transition: transform 0.3s; display: inline-block; }
        .hero-feature:hover .hover-arrow { transform: translateX(6px); }
        .hero-title { transition: color 0.2s; }
        .quick-link:hover { border-color: var(--accent); background: rgba(168,85,247,0.05); transform: translateY(-2px); }
        @media (max-width: 720px) {
          .section-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
