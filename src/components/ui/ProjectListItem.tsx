import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import type { Project } from "../../data/projects";

interface ProjectListItemProps {
  project: Project;
  index: number;
  isActive: boolean;
  onHover: () => void;
}

export default function ProjectListItem({
  project,
  index,
  isActive,
  onHover,
}: ProjectListItemProps) {
  return (
    <motion.div
      onMouseEnter={onHover}
      className="project-list-item group cursor-pointer py-8 px-8 transition-all duration-300"
    >
      <div className="flex items-start gap-6">
        {/* Number prefix */}
        <span
          className={`font-mono text-sm pt-2 transition-colors duration-300 ${isActive ? "text-[var(--color-accent)]" : "text-white/30"
            }`}
        >
          _{String(index + 1).padStart(2, "0")}.
        </span>

        <div className="flex-1">
          {/* Title with external link icon */}
          <div className="mb-2 flex items-center gap-2">
            <h3
              className={`text-3xl font-bold transition-all duration-300 lg:text-4xl ${isActive
                ? "text-[var(--color-accent)]"
                : "text-white/40 group-hover:text-white/60"
                }`}
            >
              {project.title}
            </h3>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
            >
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] transition-all duration-200 hover:bg-[var(--color-accent)]/30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiExternalLink className="h-4 w-4" />
                </a>
              )}
            </motion.div>
          </div>

          {/* Tech stack with dots as separators */}
          <div className="flex flex-wrap items-center gap-2">
            {project.techStack.map((tech, techIndex) => (
              <div key={tech} className="flex items-center gap-2">
                <span
                  className={`text-sm transition-colors duration-300 ${isActive ? "text-white/80" : "text-white/40"
                    }`}
                >
                  {tech}
                </span>
                {techIndex < project.techStack.length - 1 && (
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                )}
              </div>
            ))}
          </div>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isActive ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 h-[2px] origin-left bg-gradient-to-r from-[var(--color-accent)] to-transparent"
          />
        </div>
      </div>
    </motion.div>
  );
}
