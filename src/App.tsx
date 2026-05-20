import { useState, useEffect } from "react";
import { useHashRoute, parseRoute } from "./hooks/useHashRoute";
import { PAGE_SEQUENCE } from "./data/pageSequence";
import Nav from "./components/layout/Nav";
import HomePage from "./components/pages/HomePage";
import AboutPage from "./components/pages/AboutPage";
import WritingPage from "./components/pages/WritingPage";
import Article from "./components/pages/Article";
import WorkPage from "./components/pages/WorkPage";
import CareerPage from "./components/pages/CareerPage";
import SkillsPage from "./components/pages/SkillsPage";
import ContactPage from "./components/pages/ContactPage";

interface Tweaks {
  accent: string;
  theme: "dark" | "light";
  density: "compact" | "spacious";
  grain: boolean;
}

const TWEAK_DEFAULTS: Tweaks = {
  accent: "#a855f7",
  theme: "dark",
  density: "spacious",
  grain: false,
};

export default function App() {
  const [tweaks, setTweaks] = useState<Tweaks>(TWEAK_DEFAULTS);
  const hash = useHashRoute();
  const route = parseRoute(hash);

  // Apply tweaks to DOM
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", tweaks.accent);
    document.documentElement.style.setProperty("--accent-soft", `${tweaks.accent}20`);

    const classes: string[] = [];
    if (tweaks.theme === "light") classes.push("theme-light");
    classes.push(`density-${tweaks.density}`);
    if (tweaks.grain) classes.push("grain");
    document.body.className = classes.join(" ");
    document.body.style.backgroundColor = tweaks.theme === "light" ? "#fafaf9" : "#0a0a0a";
    document.body.style.color = tweaks.theme === "light" ? "#0a0a0a" : "#ffffff";
  }, [tweaks]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [route.type, route.slug]);

  // Arrow key navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (route.type === "article") return;
      const idx = PAGE_SEQUENCE.findIndex((p) => p.id === route.type);
      if (idx === -1) return;
      if (e.key === "ArrowRight" && idx < PAGE_SEQUENCE.length - 1) {
        window.location.hash = PAGE_SEQUENCE[idx + 1].path;
      } else if (e.key === "ArrowLeft" && idx > 0) {
        window.location.hash = PAGE_SEQUENCE[idx - 1].path;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [route.type]);

  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setPanelOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setPanelOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const updateTweak = <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => {
    setTweaks((prev) => ({ ...prev, [key]: value }));
  };

  let page: React.ReactNode;
  switch (route.type) {
    case "about":   page = <AboutPage key="about" />; break;
    case "writing": page = <WritingPage key="writing" />; break;
    case "article": page = <Article key={`a-${route.slug}`} slug={route.slug!} />; break;
    case "work":    page = <WorkPage key="work" />; break;
    case "career":  page = <CareerPage key="career" />; break;
    case "skills":  page = <SkillsPage key="skills" />; break;
    case "contact": page = <ContactPage key="contact" />; break;
    default:        page = <HomePage key="home" />;
  }

  return (
    <div>
      <div className="ambient" />
      <Nav route={route} />
      <main style={{ position: "relative", zIndex: 1 }}>
        {page}
      </main>

      {panelOpen && (
        <TweaksPanel
          tweaks={tweaks}
          updateTweak={updateTweak}
          onClose={() => {
            setPanelOpen(false);
            window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
          }}
        />
      )}
    </div>
  );
}

function TweaksPanel({
  tweaks,
  updateTweak,
  onClose,
}: {
  tweaks: Tweaks;
  updateTweak: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void;
  onClose: () => void;
}) {
  const accents = [
    { label: "Purple", value: "#a855f7" },
    { label: "Amber", value: "#f59e0b" },
    { label: "Teal", value: "#14b8a6" },
    { label: "Rose", value: "#f43f5e" },
    { label: "Sky", value: "#38bdf8" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        background: "#111114",
        border: "1px solid #27272a",
        borderRadius: "8px",
        padding: "1.25rem",
        width: "280px",
        zIndex: 100,
        fontFamily: "var(--font-sans)",
        color: "#fff",
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Tweaks
        </span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", fontSize: "16px" }}>×</button>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "11px", color: "#71717a", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Accent</div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {accents.map((a) => (
            <button key={a.value} onClick={() => updateTweak("accent", a.value)} title={a.label}
              style={{ width: "28px", height: "28px", borderRadius: "50%", background: a.value, border: tweaks.accent === a.value ? "2px solid #fff" : "2px solid transparent", cursor: "pointer" }} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "11px", color: "#71717a", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Theme</div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {(["dark", "light"] as const).map((t) => (
            <button key={t} onClick={() => updateTweak("theme", t)}
              style={{ flex: 1, padding: "0.45rem", fontSize: "12px", background: tweaks.theme === t ? "#27272a" : "transparent", border: "1px solid #27272a", borderRadius: "4px", color: "#fff", cursor: "pointer", textTransform: "capitalize" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "11px", color: "#71717a", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Density</div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {(["compact", "spacious"] as const).map((t) => (
            <button key={t} onClick={() => updateTweak("density", t)}
              style={{ flex: 1, padding: "0.45rem", fontSize: "12px", background: tweaks.density === t ? "#27272a" : "transparent", border: "1px solid #27272a", borderRadius: "4px", color: "#fff", cursor: "pointer", textTransform: "capitalize" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: "11px", color: "#71717a", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Film grain</div>
        <button onClick={() => updateTweak("grain", !tweaks.grain)}
          style={{ width: "100%", padding: "0.45rem", fontSize: "12px", background: tweaks.grain ? "#27272a" : "transparent", border: "1px solid #27272a", borderRadius: "4px", color: "#fff", cursor: "pointer" }}>
          {tweaks.grain ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
}
