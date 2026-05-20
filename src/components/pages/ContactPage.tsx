import Ornament from "../ui/Ornament";
import PageFooterNav from "../layout/PageFooterNav";

const links = [
  { label: "Email", value: "aryansarswat2000@gmail.com", href: "mailto:aryansarswat2000@gmail.com" },
  { label: "GitHub", value: "github.com/AryanSarswat", href: "https://github.com/AryanSarswat" },
  { label: "LinkedIn", value: "linkedin.com/in/aryan-sarswat", href: "https://linkedin.com/in/aryan-sarswat" },
  { label: "Résumé", value: "aryan-sarswat.pdf", href: "/aryan/resume.pdf" },
];

export default function ContactPage() {
  return (
    <div className="page-frame page-enter">
      <section
        style={{ padding: "8rem 2rem 4rem", position: "relative", minHeight: "70vh" }}
      >
        <div style={{ position: "absolute", top: "20%", right: "5%", pointerEvents: "none" }}>
          <Ornament size={180} opacity={0.18} />
        </div>

        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}>
            <span className="numeral" style={{ fontSize: "14px" }}>§ 06</span>
            <span className="eyebrow eyebrow-accent">Contact</span>
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
              <span className="mask-reveal" style={{ display: "block" }}>
                Want to <em style={{ color: "var(--accent)", fontStyle: "italic" }}>talk?</em>
              </span>
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
              Always up for chatting about ML research, agentic systems, or trading paper
              recommendations.
            </p>
          </div>

          <div style={{ marginTop: "4rem", maxWidth: "720px" }}>
            {links.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                target={l.label === "Email" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="contact-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 40px",
                  gap: "2rem",
                  alignItems: "center",
                  padding: "1.75rem 1rem",
                  margin: "0 -1rem",
                  borderTop: "1px solid var(--line)",
                  borderBottom: i === links.length - 1 ? "1px solid var(--line)" : "none",
                  transition: "all 0.3s",
                  textDecoration: "none",
                  color: "inherit",
                  animation: `fadeUp 0.6s ${0.3 + i * 0.08}s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`,
                }}
              >
                <span className="eyebrow eyebrow-accent">{l.label}</span>
                <span
                  className="contact-value"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.3rem",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {l.value}
                </span>
                <span
                  className="contact-arrow"
                  style={{
                    color: "var(--muted-2)",
                    fontSize: "1.2rem",
                    textAlign: "right",
                    transition: "transform 0.3s, color 0.3s",
                  }}
                >
                  →
                </span>
              </a>
            ))}
          </div>

          <p
            style={{
              marginTop: "5rem",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              color: "var(--muted)",
              fontSize: "1.1rem",
              maxWidth: "480px",
              animation: "fadeUp 0.8s 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) backwards",
            }}
          >
            Otherwise, you'll find me on the bouldering wall, in the gym, or asleep — usually in
            that order.
          </p>
        </div>
      </section>
      <PageFooterNav currentId="contact" />
      <style>{`
        .contact-row:hover { background: rgba(168,85,247,0.04); padding-left: 1.5rem !important; }
        .contact-row:hover .contact-value { color: var(--accent); }
        .contact-row:hover .contact-arrow { transform: translateX(6px); color: var(--accent); }
        .contact-value { transition: color 0.3s; }
      `}</style>
    </div>
  );
}
