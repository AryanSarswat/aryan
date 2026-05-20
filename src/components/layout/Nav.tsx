import { useState, useEffect } from "react";
import type { Route } from "../../hooks/useHashRoute";

interface NavProps {
  route: Route;
}

const links = [
  { id: "about", label: "About", path: "/about" },
  { id: "writing", label: "Writing", path: "/writing" },
  { id: "work", label: "Work", path: "/work" },
  { id: "career", label: "Career", path: "/career" },
  { id: "skills", label: "Skills", path: "/skills" },
  { id: "contact", label: "Contact", path: "/contact" },
];

export default function Nav({ route }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (id: string) => {
    if (id === "writing" && route.type === "article") return true;
    return route.type === id;
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "1.1rem 2rem",
        background: scrolled ? "rgba(10,10,10,0.7)" : "transparent",
        backdropFilter: scrolled ? "blur(12px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        transition: "all 0.4s ease",
      }}
    >
      <div
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = "";
          }}
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "1.4rem",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "var(--fg)",
            textDecoration: "none",
          }}
        >
          Aryan Sarswat
          <span style={{ color: "var(--accent)" }}>.</span>
        </a>

        <div
          className="nav-links"
          style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}
        >
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.path}`}
              className="nav-link"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: isActive(l.id) ? "var(--fg)" : "var(--muted)",
                position: "relative",
                transition: "color 0.2s",
                textDecoration: "none",
              }}
            >
              {l.label}
              {isActive(l.id) && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: "-6px",
                    height: "1px",
                    background: "var(--accent)",
                    animation: "lineGrow 0.4s cubic-bezier(0.65, 0, 0.35, 1)",
                    transformOrigin: "left",
                    display: "block",
                  }}
                />
              )}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
