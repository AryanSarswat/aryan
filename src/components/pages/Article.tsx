import { useState, useEffect } from "react";
import { musings } from "../../hooks/useMusings";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const base = import.meta.env.BASE_URL;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface ArticleProps {
  slug: string;
}

export default function Article({ slug }: ArticleProps) {
  const post = musings.find((m) => m.slug === slug);
  const idx = musings.findIndex((m) => m.slug === slug);
  const next = musings[idx + 1] || musings[0];

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h2 style={{ fontFamily: "var(--font-serif)" }}>Post not found.</h2>
        <a href="#/writing" style={{ color: "var(--accent)" }}>← Back to writing</a>
      </div>
    );
  }

  return (
    <article className="page-enter" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      {/* Reading progress bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "2px",
          width: `${progress * 100}%`,
          background: "var(--accent)",
          zIndex: 60,
          transition: "width 0.1s",
        }}
      />

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 2rem" }}>
        <a
          href="#/writing"
          className="back-link"
          style={{
            fontSize: "13px",
            color: "var(--muted)",
            marginBottom: "3rem",
            fontFamily: "var(--font-mono)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4em",
            textDecoration: "none",
          }}
        >
          <span className="back-arrow" style={{ display: "inline-block", transition: "transform 0.3s" }}>←</span>
          Back to writing
        </a>

        <header style={{ marginTop: "2rem", marginBottom: "3rem" }}>
          <div
            className="fade-up"
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              marginBottom: "1.5rem",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--muted-2)",
            }}
          >
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readTime} read</span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.2rem, 5.5vw, 3.6rem)",
              fontWeight: 500,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
            }}
          >
            <span className="mask-reveal" style={{ animationDelay: "0.1s", display: "block" }}>
              {post.title}
            </span>
          </h1>
          <p
            className="fade-up"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "1.25rem",
              color: "var(--muted)",
              lineHeight: 1.55,
              marginBottom: "1.5rem",
              animationDelay: "0.4s",
            }}
          >
            {post.description}
          </p>
          <div
            className="fade-up"
            style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", animationDelay: "0.5s" }}
          >
            {post.tags.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  padding: "0.3rem 0.6rem",
                  border: "1px solid var(--line)",
                  borderRadius: "2px",
                  color: "var(--muted)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </header>

        <div className="rule" style={{ marginBottom: "3rem" }} />

        {/* Article body */}
        <div className="prose-editorial prose-musings drop-cap-first">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ src, alt }) => (
                <img
                  src={src?.startsWith("/") ? `${base}${src.slice(1)}` : src}
                  alt={alt}
                  style={{ maxWidth: "100%", borderRadius: "8px", margin: "1.5rem 0" }}
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "5rem", paddingTop: "2rem", borderTop: "1px solid var(--line)" }}>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              color: "var(--muted)",
              fontSize: "15px",
              marginBottom: "2rem",
            }}
          >
            Thanks for reading. Ping me on{" "}
            <a
              href="https://linkedin.com/in/aryan-sarswat"
              style={{ color: "var(--fg)", borderBottom: "1px solid var(--accent)", textDecoration: "none" }}
            >
              LinkedIn
            </a>
            {" "}or{" "}
            <a
              href="mailto:aryansarswat2000@gmail.com"
              style={{ color: "var(--fg)", borderBottom: "1px solid var(--accent)", textDecoration: "none" }}
            >
              by email
            </a>
            .
          </p>

          {next && next.slug !== slug && (
            <a
              href={`#/writing/${next.slug}`}
              className="next-card"
              style={{
                display: "block",
                padding: "1.75rem",
                border: "1px solid var(--line)",
                borderRadius: "4px",
                transition: "all 0.3s",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span className="eyebrow eyebrow-accent">Read next</span>
              <h4
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.4rem",
                  fontWeight: 500,
                  marginTop: "0.5rem",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.3,
                }}
              >
                {next.title} →
              </h4>
            </a>
          )}
        </div>
      </div>
      <style>{`
        .back-link:hover { color: var(--accent); }
        .back-link:hover .back-arrow { transform: translateX(-4px); }
        .next-card:hover { border-color: var(--accent); background: rgba(168,85,247,0.04); transform: translateY(-2px); }
        .next-card:hover h4 { color: var(--accent); }
      `}</style>
    </article>
  );
}
