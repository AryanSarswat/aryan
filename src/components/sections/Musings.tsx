import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MusingOverlay from "../ui/MusingOverlay";

interface Musing {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  content: string;
}

function parseFrontmatter(raw: string, slug: string): Musing {
  const parts = raw.split("---");
  const frontmatter = parts[1] ?? "";
  const content = parts.slice(2).join("---").trim();

  const get = (key: string): string => {
    const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return match ? match[1].trim() : "";
  };

  const tagsLine = get("tags");
  const tags = tagsLine
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    slug,
    title: get("title"),
    date: get("date"),
    tags,
    description: get("description"),
    content,
  };
}

const rawFiles = import.meta.glob("../../content/musings/*/index.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const musings: Musing[] = Object.entries(rawFiles).map(([path, raw]) => {
  const match = path.match(/\/musings\/([^/]+)\/index\.md$/);
  const slug = match ? match[1] : "";
  return parseFrontmatter(raw, slug);
});

export default function Musings() {
  const [selected, setSelected] = useState<Musing | null>(null);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--color-accent)]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[var(--color-highlight)]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="mb-16">
          <h2 className="text-5xl font-black text-white sm:text-7xl tracking-tighter mb-6">
            The <span className="text-white/40">Musings.</span>
          </h2>
          <p className="max-w-2xl text-lg font-medium text-[var(--color-muted)] sm:text-xl">
            Thoughts, experiments, and reflections - mostly on AI and building things or anything that interests me.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {musings.map((musing, i) => (
            <MusingCard
              key={musing.slug}
              musing={musing}
              index={i}
              onOpen={() => setSelected(musing)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <MusingOverlay musing={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function MusingCard({
  musing,
  index,
  onOpen,
}: {
  musing: Musing;
  index: number;
  onOpen: () => void;
}) {
  const formatted = new Date(musing.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      layoutId={`musing-card-${musing.slug}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.015 }}
      onClick={onOpen}
      className="glass rounded-2xl p-6 cursor-pointer group relative overflow-hidden border border-white/5 hover:border-[var(--color-accent)]/30 transition-colors duration-300"
      style={{ boxShadow: "0 0 0 0 transparent" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0 32px 0 rgba(168,85,247,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 0 0 0 transparent";
      }}
    >
      {/* Subtle accent corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-accent)]/5 blur-2xl rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-muted)]">
          {formatted}
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-[var(--color-accent)]/50 transition-colors">
          Read →
        </span>
      </div>

      <h3 className="text-xl font-black text-white tracking-tight mb-3 leading-tight">
        {musing.title}
      </h3>

      <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-5 line-clamp-3">
        {musing.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {musing.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[var(--color-muted)] group-hover:border-[var(--color-accent)]/20 group-hover:text-[var(--color-accent-light)] transition-all duration-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
