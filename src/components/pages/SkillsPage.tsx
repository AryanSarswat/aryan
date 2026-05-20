import { useEffect, useMemo } from "react";
import { techStack } from "../../data/techStack";
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

const CATEGORY_LABELS: Record<string, string> = {
  language: "Languages",
  ml: "ML & AI",
  web: "Web & Backend",
  tools: "Infrastructure",
};

const ROMAN = ["I", "II", "III", "IV"];

export default function SkillsPage() {
  useRevealOnMount();

  const grouped = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const item of techStack) {
      const label = CATEGORY_LABELS[item.category] || item.category;
      if (!map[label]) map[label] = [];
      map[label].push(item.name);
    }
    return Object.entries(map);
  }, []);

  return (
    <div className="page-frame page-enter">
      <section style={{ padding: "8rem 2rem 4rem", position: "relative" }}>
        <div style={{ position: "absolute", top: "12%", right: "5%", pointerEvents: "none" }}>
          <Ornament size={120} opacity={0.16} />
        </div>

        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}>
            <span className="numeral" style={{ fontSize: "14px" }}>§ 05</span>
            <span className="eyebrow eyebrow-accent">Toolkit</span>
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
              <span className="mask-reveal" style={{ display: "block" }}>What I work with.</span>
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
              The things I've spent enough time with to have opinions about.
            </p>
          </div>

          <div
            className="skills-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "3rem",
              marginTop: "4rem",
            }}
          >
            {grouped.map(([cat, items], i) => (
              <div key={cat} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <span className="numeral" style={{ fontSize: "1.4rem" }}>
                    {ROMAN[i] || String(i + 1)}
                  </span>
                  <span className="eyebrow eyebrow-accent">{cat}</span>
                  <span
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "var(--line)",
                      display: "block",
                      alignSelf: "center",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "var(--muted-2)",
                    }}
                  >
                    {String(items.length).padStart(2, "0")}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {items.map((t, j) => (
                    <span
                      key={t}
                      className="skill-pill"
                      style={{
                        fontSize: "13px",
                        padding: "0.45rem 0.85rem",
                        border: "1px solid var(--line)",
                        borderRadius: "2px",
                        color: "var(--fg)",
                        transition: "all 0.2s",
                        cursor: "default",
                        animation: `fadeUp 0.4s ${0.3 + j * 0.015}s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PageFooterNav currentId="skills" />
      <style>{`
        .skill-pill:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); }
        @media (max-width: 720px) {
          .skills-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </div>
  );
}
