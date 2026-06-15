import { useEffect, useState } from "react";
import { RESUME_URL } from "../../data/config";
import { scrollToId } from "../../data/journey";

const DOMAINS = [
  "LLMs",
  "agentic systems",
  "deep learning",
  "reinforcement learning",
  "computer vision",
  "robotics",
  "ML security",
];

export default function Hero() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "America/Los_Angeles",
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
    <section id="hero" data-journey className="section section-min">
      <div className="section-inner">
        {/* HUD status row */}
        <div
          className="fade-up"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "clamp(3rem, 8vh, 5rem)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <span
              className="pulse-dot"
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#22d3ee",
                display: "inline-block",
              }}
            />
            <span className="hud-label">Operational — Expedia Group</span>
          </div>
          <span className="hud-label">
            47.6°N · SEA · {time}
            <span className="blink"> ▌</span>
          </span>
        </div>

        {/* Eyebrow */}
        <p
          className="fade-up hud-label hud-accent"
          style={{ animationDelay: "0.15s", marginBottom: "1.5rem" }}
        >
          Machine Learning Scientist II // Full-Stack Developer
        </p>

        {/* Name */}
        <h1
          className="display-xl"
          style={{ fontSize: "clamp(3rem, 13vw, 11rem)", marginBottom: "2rem" }}
        >
          <span className="mask-reveal text-gradient" style={{ display: "block", animationDelay: "0.2s" }}>
            ARYAN
          </span>
          <span
            className="mask-reveal text-accent-glow"
            style={{ display: "block", animationDelay: "0.4s" }}
          >
            SARSWAT
          </span>
        </h1>

        {/* Strapline */}
        <p
          className="fade-up"
          style={{
            animationDelay: "0.7s",
            maxWidth: "640px",
            fontSize: "clamp(1.05rem, 1.9vw, 1.4rem)",
            color: "var(--muted)",
            lineHeight: 1.55,
            marginBottom: "2.75rem",
          }}
        >
          I turn state-of-the-art research into{" "}
          <span style={{ color: "var(--fg)" }}>agentic systems</span> that reach millions —
          and write about what I learn along the way.
        </p>

        {/* CTAs */}
        <div
          className="fade-up"
          style={{ animationDelay: "0.9s", display: "flex", gap: "1rem", flexWrap: "wrap" }}
        >
          <button className="btn" onClick={() => scrollToId("work")}>
            Explore the work <span className="arrow">→</span>
          </button>
          <a className="btn" href={RESUME_URL} target="_blank" rel="noopener noreferrer" download>
            Download résumé
          </a>
        </div>
      </div>

      {/* Bottom: scroll cue + domain marquee */}
      <div
        className="fade-up"
        style={{
          animationDelay: "1.1s",
          position: "absolute",
          bottom: "1.6rem",
          left: 0,
          right: 0,
          padding: "0 clamp(1.25rem, 5vw, 3rem)",
        }}
      >
        <div className="marquee">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i}>
                {DOMAINS.map((d) => `✦ ${d} `).join(" ")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
