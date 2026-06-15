import { musings } from "../../hooks/useMusings";
import { formatDate } from "../../utils/date";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export default function Writing({ onOpen }: { onOpen: (slug: string) => void }) {
  const featured = musings.find((m) => m.featured) ?? musings[0];
  const rest = musings.filter((m) => m !== featured);

  return (
    <section id="writing" data-journey className="section">
      <div className="section-inner">
        <div className="eyebrow-row reveal">
          <span className="section-index">02</span>
          <span className="hud-label hud-accent">Writing</span>
          <span className="line" />
        </div>

        <h2
          className="display-xl reveal"
          style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", marginBottom: "0.85rem" }}
        >
          Field notes.
        </h2>
        <p
          className="reveal"
          style={{ color: "var(--muted)", maxWidth: "560px", marginBottom: "3rem" }}
        >
          Notes on AI, building, and whatever else is rattling around — click to read.
        </p>

        {/* Featured */}
        {featured && (
          <button
            className="featured reveal bracket-frame"
            onClick={() => onOpen(featured.slug)}
          >
            <div className="featured-meta">
              <span className="hud-label hud-accent">Featured</span>
              <span className="hud-label">
                {formatDate(featured.date, "short")} · {featured.readTime}
              </span>
            </div>
            <h3 className="featured-title">{featured.title}</h3>
            <p className="featured-desc">{featured.description}</p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
              {featured.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
            <span className="btn-ghost group-arrow" style={{ color: "var(--accent)" }}>
              Read essay <span className="arrow">→</span>
            </span>
          </button>
        )}

        {/* Earlier essays / placeholder */}
        <div className="reveal" style={{ marginTop: "3rem" }}>
          <div className="eyebrow-row">
            <span className="hud-label">Archive</span>
            <span className="line" />
            <span className="hud-label">
              {String(rest.length).padStart(2, "0")}
            </span>
          </div>

          {rest.length > 0 ? (
            rest.map((m, i) => (
              <button
                key={m.slug}
                className="post-row"
                onClick={() => onOpen(m.slug)}
              >
                <span className="section-index" style={{ fontSize: "1.1rem" }}>
                  {ROMAN[i + 1] ?? String(i + 2)}
                </span>
                <span className="post-date hud-label">{formatDate(m.date, "short")}</span>
                <div style={{ textAlign: "left" }}>
                  <h4
                    className="post-title font-display"
                    style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "0.3rem" }}
                  >
                    {m.title}
                  </h4>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>
                    {m.description}
                  </p>
                </div>
                <span className="post-readtime hud-label" style={{ textAlign: "right" }}>
                  {m.readTime}
                </span>
              </button>
            ))
          ) : (
            <div
              className="post-row"
              style={{ cursor: "default", gridTemplateColumns: "56px 1fr", opacity: 0.7 }}
            >
              <span className="section-index" style={{ fontSize: "1.1rem" }}>
                II
              </span>
              <p style={{ color: "var(--faint)", fontStyle: "italic", textAlign: "left" }}>
                More field notes in progress — check back soon.
              </p>
            </div>
          )}
          <div style={{ borderTop: "1px solid var(--line)" }} />
        </div>
      </div>

      <style>{`
        .featured {
          display: block;
          width: 100%;
          text-align: left;
          cursor: pointer;
          background: linear-gradient(135deg, rgba(34,211,238,0.07), rgba(34,211,238,0.01));
          border: 1px solid var(--line-strong);
          padding: clamp(1.6rem, 3vw, 2.5rem);
          transition: border-color 0.4s var(--ease), transform 0.4s var(--ease);
        }
        .featured:hover { border-color: var(--accent-deep); transform: translateY(-4px); }
        .featured-meta { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .featured-title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 3.4vw, 2.4rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 1rem;
          transition: color 0.3s var(--ease);
        }
        .featured:hover .featured-title { color: var(--accent); }
        .featured-desc { color: var(--muted); font-size: clamp(1rem, 1.6vw, 1.15rem); line-height: 1.6; max-width: 640px; margin-bottom: 1.5rem; }
      `}</style>
    </section>
  );
}
