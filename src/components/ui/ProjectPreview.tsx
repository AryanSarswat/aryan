import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import type { Project } from "../../data/projects";

interface ProjectPreviewProps {
  project: Project | null;
}

export default function ProjectPreview({ project }: ProjectPreviewProps) {
  if (!project) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="min-h-[500px] h-fit overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/[0.03] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-sm"
      >
        {/* Image/Gradient Placeholder */}
        <div className="relative h-64 overflow-hidden lg:h-80">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            className="h-full w-full bg-gradient-to-br from-[var(--color-accent)]/30 via-purple-500/20 to-blue-500/20"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent" />

          {/* Category badge overlay */}
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute left-6 top-6 rounded-full bg-[var(--color-accent)]/20 px-3 py-1 text-xs font-medium text-[var(--color-accent)] backdrop-blur-sm"
          >
            {project.category}
          </motion.span>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 border-l-2 border-[var(--color-accent)]/40 pl-4 text-sm leading-relaxed text-white/70 lg:text-base"
          >
            {project.description}
          </motion.p>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 flex flex-wrap gap-2"
          >
            {project.techStack.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="rounded-md bg-white/10 px-3 py-1.5 text-xs text-white/80 transition-colors duration-200 hover:bg-[var(--color-accent)]/20 hover:text-white"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>

          {/* GitHub/External Link Button */}
          {project.link && (
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/20"
            >
              {project.link.includes("github") ? (
                <>
                  <FiGithub className="h-4 w-4" />
                  <span>View on GitHub</span>
                </>
              ) : (
                <>
                  <FiExternalLink className="h-4 w-4" />
                  <span>View Project</span>
                </>
              )}
              <motion.span
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </motion.span>
            </motion.a>
          )}
        </div>

        {/* Accent bottom line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-60" />
      </motion.div>
    </AnimatePresence>
  );
}
