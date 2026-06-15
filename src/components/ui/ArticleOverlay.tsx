import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { musings } from "../../hooks/useMusings";
import { formatDate } from "../../utils/date";

const BASE = import.meta.env.BASE_URL;

/** Re-base root-absolute asset paths (e.g. /musings/..png) onto the deploy base. */
function fixSrc(src?: string): string | undefined {
  if (!src) return src;
  if (/^https?:/.test(src)) return src;
  return BASE + src.replace(/^\//, "");
}

export default function ArticleOverlay({
  slug,
  onClose,
}: {
  slug: string | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const article = slug ? musings.find((m) => m.slug === slug) : undefined;

  useEffect(() => {
    if (!article) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [article, onClose]);

  if (!article) return null;

  return (
    <div
      className="overlay-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={article.title}
    >
      <article
        className="overlay-panel fade-up"
        onClick={(e) => e.stopPropagation()}
        style={{ animationDuration: "0.5s" }}
      >
        <button
          ref={closeRef}
          className="overlay-close"
          onClick={onClose}
          aria-label="Close article"
        >
          ✕
        </button>

        <div
          className="hud-label"
          style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}
        >
          <span className="hud-accent">{formatDate(article.date, "long")}</span>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>

        <h1
          className="font-display"
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.08,
            color: "#fff",
            marginBottom: "1rem",
          }}
        >
          {article.title}
        </h1>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          {article.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        <div className="hairline" style={{ marginBottom: "2rem", opacity: 0.6 }} />

        <div className="prose">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ src, alt }) => (
                <img src={fixSrc(src as string)} alt={alt ?? ""} loading="lazy" />
              ),
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {article.content}
          </Markdown>
        </div>
      </article>
    </div>
  );
}
