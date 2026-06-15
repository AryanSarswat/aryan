import { useState } from "react";
import { FiGithub, FiLinkedin, FiMail, FiFileText } from "react-icons/fi";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, MAILTO, RESUME_URL } from "../../data/config";
import { scrollToId } from "../../data/journey";

const links = [
  { label: "Email", value: EMAIL, href: MAILTO, Icon: FiMail, external: false },
  { label: "GitHub", value: "github.com/AryanSarswat", href: GITHUB_URL, Icon: FiGithub, external: true },
  { label: "LinkedIn", value: "linkedin.com/in/aryan-sarswat", href: LINKEDIN_URL, Icon: FiLinkedin, external: true },
  { label: "Résumé", value: "aryan-sarswat.pdf", href: RESUME_URL, Icon: FiFileText, external: true },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio — message from ${form.name || "someone"}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ""}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
    window.setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" data-journey className="section" style={{ minHeight: "100vh" }}>
      <div className="section-inner">
        <div className="eyebrow-row reveal">
          <span className="section-index">05</span>
          <span className="hud-label hud-accent">Contact</span>
          <span className="line" />
        </div>

        <h2
          className="display-xl reveal"
          style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)", marginBottom: "1rem" }}
        >
          Let's build<br />
          <span className="text-accent-glow">something.</span>
        </h2>
        <p
          className="reveal"
          style={{ color: "var(--muted)", maxWidth: "520px", marginBottom: "3.5rem", fontSize: "1.05rem" }}
        >
          Open to research collaborations, hard ML problems, or just trading paper recommendations.
        </p>

        <div className="contact-grid">
          {/* Form */}
          <form className="glass reveal" onSubmit={submit} style={{ padding: "clamp(1.5rem, 3vw, 2.25rem)" }}>
            <div className="hud-label hud-accent" style={{ marginBottom: "1.5rem" }}>
              Transmit message
            </div>
            <div style={{ display: "grid", gap: "1rem" }}>
              <input
                className="input-field"
                placeholder="Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="input-field"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                className="input-field"
                placeholder="Message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ resize: "vertical", minHeight: 110 }}
              />
              <button type="submit" className="btn" style={{ justifyContent: "center" }}>
                {sent ? "Opening mail client…" : "Send transmission →"}
              </button>
            </div>
          </form>

          {/* Direct links */}
          <div className="reveal">
            {links.map(({ label, value, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="contact-row"
              >
                <span className="hud-label hud-accent" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={14} /> {label}
                </span>
                <span
                  className="contact-value font-display"
                  style={{ fontSize: "1.05rem", fontWeight: 600 }}
                >
                  {value}
                </span>
                <span className="contact-arrow" style={{ textAlign: "right", color: "var(--faint)" }}>
                  ↗
                </span>
              </a>
            ))}
            <p style={{ color: "var(--faint)", fontStyle: "italic", marginTop: "1.75rem", fontSize: 14 }}>
              Otherwise, you'll find me on the bouldering wall, in the gym, or asleep — usually in
              that order.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            marginTop: "clamp(4rem, 10vh, 7rem)",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <span className="hud-label">© {new Date().getFullYear()} Aryan Sarswat</span>
          <span className="hud-label">Built with React · R3F · GSAP</span>
          <button className="btn-ghost group-arrow" onClick={() => scrollToId("hero")}>
            Back to top <span className="arrow">↑</span>
          </button>
        </footer>
      </div>

      <style>{`
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start; }
        @media (max-width: 820px) { .contact-grid { grid-template-columns: 1fr; gap: 2rem; } }
      `}</style>
    </section>
  );
}
