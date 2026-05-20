import { PAGE_SEQUENCE, getPageNeighbors } from "../../data/pageSequence";

interface PageFooterNavProps {
  currentId: string;
}

export default function PageFooterNav({ currentId }: PageFooterNavProps) {
  const { prev, next, idx, total } = getPageNeighbors(currentId);

  return (
    <div
      style={{
        borderTop: "1px solid var(--line)",
        marginTop: "6rem",
        padding: "3rem 2rem 4rem",
      }}
    >
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
        {/* Progress strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--muted-2)",
            marginBottom: "2rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          <span>
            {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div style={{ flex: 1, margin: "0 1.5rem", display: "flex", gap: "4px" }}>
            {PAGE_SEQUENCE.map((p, i) => (
              <a
                key={p.id}
                href={`#${p.path}`}
                title={p.label}
                style={{
                  flex: 1,
                  height: "2px",
                  background: i === idx ? "var(--accent)" : "var(--line-strong)",
                  transition: "background 0.3s",
                  display: "block",
                }}
              />
            ))}
          </div>
          <span>{(PAGE_SEQUENCE[idx]?.label || "").toUpperCase()}</span>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
          className="footer-nav-grid"
        >
          {prev ? (
            <a
              href={`#${prev.path}`}
              className="page-nav-card"
              style={{
                padding: "2rem",
                border: "1px solid var(--line)",
                borderRadius: "4px",
                transition: "all 0.3s",
                display: "block",
                textDecoration: "none",
                color: "var(--fg)",
              }}
            >
              <span className="eyebrow" style={{ fontSize: "10px" }}>← Previous</span>
              <h4
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.6rem",
                  fontWeight: 500,
                  marginTop: "0.5rem",
                  letterSpacing: "-0.015em",
                }}
              >
                {prev.label}
              </h4>
            </a>
          ) : (
            <div />
          )}
          {next ? (
            <a
              href={`#${next.path}`}
              className="page-nav-card"
              style={{
                padding: "2rem",
                border: "1px solid var(--line)",
                borderRadius: "4px",
                transition: "all 0.3s",
                display: "block",
                textAlign: "right",
                textDecoration: "none",
                color: "var(--fg)",
              }}
            >
              <span className="eyebrow eyebrow-accent" style={{ fontSize: "10px" }}>Next →</span>
              <h4
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.6rem",
                  fontWeight: 500,
                  marginTop: "0.5rem",
                  letterSpacing: "-0.015em",
                }}
              >
                {next.label}
              </h4>
            </a>
          ) : (
            <div />
          )}
        </div>
      </div>
      <style>{`
        .page-nav-card:hover { border-color: var(--accent); background: rgba(168,85,247,0.04); transform: translateY(-2px); }
        .page-nav-card:hover h4 { color: var(--accent); }
        @media (max-width: 600px) {
          .footer-nav-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
