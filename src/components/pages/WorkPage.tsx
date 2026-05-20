import { useEffect, useRef } from "react";
import { projects } from "../../data/projects";
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

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

function WorkCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <a
      ref={cardRef}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="work-card reveal"
      onMouseMove={onMouseMove}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "2rem",
        border: "1px solid var(--line)",
        borderRadius: "4px",
        transition: "all 0.3s",
        position: "relative",
        minHeight: "240px",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        transitionDelay: `${(index % 2) * 0.08 + Math.floor(index / 2) * 0.06}s`,
      }}
    >
      {/* Hover glow */}
      <div
        className="work-glow"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          background:
            "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(168,85,247,0.15), transparent 60%)",
          transition: "opacity 0.4s",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          <span className="eyebrow">{project.category}</span>
          <span className="numeral" style={{ fontSize: "1.5rem", lineHeight: 1 }}>
            {ROMAN[index] || String(index + 1)}
          </span>
        </div>
        <h3
          className="work-title"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.6rem",
            fontWeight: 500,
            letterSpacing: "-0.018em",
            marginBottom: "0.75rem",
            lineHeight: 1.2,
          }}
        >
          {project.title}{" "}
          <span style={{ color: "var(--muted-2)", fontSize: "0.7em" }} className="work-arrow">
            ↗
          </span>
        </h3>
        <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          {project.description}
        </p>
      </div>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", position: "relative" }}>
        {project.techStack.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--muted-2)",
              padding: "0.2rem 0.5rem",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--line)",
              borderRadius: "2px",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}

export default function WorkPage() {
  useRevealOnMount();

  return (
    <div className="page-frame page-enter">
      <section style={{ padding: "8rem 2rem 4rem", position: "relative" }}>
        <div style={{ position: "absolute", top: "12%", right: "5%", pointerEvents: "none" }}>
          <Ornament size={120} opacity={0.16} />
        </div>

        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}>
            <span className="numeral" style={{ fontSize: "14px" }}>§ 03</span>
            <span className="eyebrow eyebrow-accent">Selected work</span>
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
              <span className="mask-reveal" style={{ display: "block" }}>Things I've built.</span>
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
              Research, side projects, the occasional weekend hack.
            </p>
          </div>

          <div
            className="work-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.25rem",
              marginTop: "4rem",
            }}
          >
            {projects.map((p, i) => (
              <WorkCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>
      <PageFooterNav currentId="work" />
      <style>{`
        .work-card:hover { border-color: var(--accent); transform: translateY(-3px); }
        .work-card:hover .work-glow { opacity: 1; }
        .work-card:hover .work-title { color: var(--accent); }
        .work-card:hover .work-arrow { transform: translate(3px, -3px); display: inline-block; }
        .work-arrow { transition: transform 0.3s; }
        .work-title { transition: color 0.2s; }
        @media (max-width: 720px) {
          .work-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
