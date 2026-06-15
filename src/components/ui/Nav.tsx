import { useState } from "react";
import { RESUME_URL } from "../../data/config";
import { JOURNEY, scrollToId } from "../../data/journey";

export default function Nav({ active }: { active: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <nav className="nav" aria-label="Primary">
        <button className="nav-mark" onClick={() => go("hero")} aria-label="Back to top">
          ARYAN<span style={{ color: "#22d3ee" }}>/</span>SARSWAT
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "1.6rem" }}>
          <div className="nav-links">
            {JOURNEY.slice(1).map((s) => (
              <button
                key={s.id}
                className="nav-link"
                data-active={active === s.id}
                onClick={() => go(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <a
            className="nav-link"
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ opacity: 1 }}
          >
            Résumé ↗
          </a>
          <button
            className="nav-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="nav-menu glass-strong">
          {JOURNEY.slice(1).map((s) => (
            <button key={s.id} data-active={active === s.id} onClick={() => go(s.id)}>
              <span className="section-index">{s.index}</span> {s.label}
            </button>
          ))}
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
            <span className="section-index">↗</span> Résumé
          </a>
        </div>
      )}
    </>
  );
}
