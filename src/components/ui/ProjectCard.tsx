import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import type { Project } from "../../data/projects";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.02,
        rotateY: 2,
        rotateX: -2,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className="group relative flex h-[280px] w-[350px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/[0.03] px-6 pb-6 pt-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-sm transition-colors duration-300 hover:border-[var(--color-accent)]/50 hover:bg-gradient-to-br hover:from-white/15 hover:to-white/[0.05] sm:w-[400px]"
    >
      {/* Accent top line */}
      <div className="absolute left-6 right-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Animated border glow on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          background:
            "linear-gradient(135deg, transparent 40%, var(--color-accent) 50%, transparent 60%)",
          backgroundSize: "200% 200%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* Project number & GitHub link */}
      <div className="absolute right-6 top-6 flex flex-col items-end gap-2">
        <span className="text-6xl font-bold text-white/10 transition-colors duration-300 group-hover:text-[var(--color-accent)]/20">
          {String(project.id).padStart(2, "0")}
        </span>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all duration-200 hover:bg-[var(--color-accent)]/30 hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {project.link.includes("github") ? (
              <FiGithub className="h-4 w-4" />
            ) : (
              <FiExternalLink className="h-4 w-4" />
            )}
          </a>
        )}
      </div>

      {/* Category badge */}
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
        className="mb-4 w-fit rounded-full bg-[var(--color-accent)]/20 px-3 py-1 text-xs font-medium text-[var(--color-accent)]"
      >
        {project.category}
      </motion.span>

      {/* Title */}
      <h3 className="mb-3 text-2xl font-bold text-white">{project.title}</h3>

      {/* Description */}
      <p className="mb-6 border-l-2 border-transparent pl-3 text-sm leading-relaxed text-white/60 transition-all duration-300 group-hover:border-[var(--color-accent)]/40 group-hover:text-white/70">
        {project.description}
      </p>

      {/* Separator line */}
      <div className="mb-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Tech stack with staggered animation on hover */}
      <div className="flex flex-wrap gap-2 pb-1">
        {project.techStack.map((tech, techIndex) => (
          <motion.span
            key={tech}
            initial={{ opacity: 0.8, scale: 1 }}
            whileHover={{ scale: 1.1, opacity: 1 }}
            transition={{
              duration: 0.2,
              delay: techIndex * 0.03,
            }}
            className="rounded-md bg-white/10 px-2 py-1 text-xs text-white/80 transition-colors duration-200 group-hover:bg-[var(--color-accent)]/20 group-hover:text-white"
          >
            {tech}
          </motion.span>
        ))}
      </div>

      {/* Hover gradient overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-accent)]/10 to-transparent"
      />
    </motion.div>
  );
}
