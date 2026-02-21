import { useEffect } from "react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const base = import.meta.env.BASE_URL

interface Musing {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  content: string;
}

interface Props {
  musing: Musing;
  onClose: () => void;
}

export default function MusingOverlay({ musing, onClose }: Props) {
  const formatted = new Date(musing.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Scrollable wrapper */}
      <div className="fixed inset-0 z-50 overflow-y-auto flex justify-center py-12 px-4" onClick={onClose}>
        <motion.article
          layoutId={`musing-card-${musing.slug}`}
          transition={{ type: "spring", damping: 30, stiffness: 250 }}
          className="glass rounded-2xl w-full max-w-[720px] h-fit border border-white/8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-8 pb-6">
            {/* Back button */}
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-[var(--color-muted)] hover:text-white text-sm font-bold transition-colors mb-6 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
              Back
            </button>

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {formatted}
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2 mb-4 leading-tight">
              {musing.title}
            </h2>

            <div className="flex flex-wrap gap-2 mb-6">
              {musing.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent-light)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Gradient separator */}
            <div className="h-px bg-gradient-to-r from-[var(--color-accent)]/30 via-white/10 to-transparent" />
          </div>

          {/* Body */}
          <div className="px-8 pb-12">
            <div className="prose-musings">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ src, alt }) => (
                    <img
                      src={src?.startsWith("/") ? `${base}${src.slice(1)}` : src}
                      alt={alt}
                    />
                  ),
                }}
              >
                {musing.content}
              </ReactMarkdown>
            </div>
          </div>
        </motion.article>
      </div>
    </>
  );
}
