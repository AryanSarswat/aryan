import type { TechItem } from "../../data/techStack";

interface TechIconProps {
  tech: TechItem;
}

export default function TechIcon({ tech }: TechIconProps) {
  return (
    <div
      className="group relative flex h-36 w-32 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-[var(--tech-color)]/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:bg-white/[0.06]"
      style={{
        ['--tech-color' as string]: tech.color,
      }}
    >
      {/* Subtle glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10"
        style={{ backgroundColor: tech.color }}
      />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Icon with brand color and scale on hover */}
      <div className="relative z-10">
        <i
          className={`${tech.icon} text-6xl text-white/60 transition-all duration-500 group-hover:scale-110 group-hover:text-[var(--tech-color)] group-hover:drop-shadow-[0_0_25px_var(--tech-color)]`}
        />
      </div>

      <span className="relative z-10 text-sm font-medium text-white/50 transition-colors duration-500 group-hover:text-white/90">
        {tech.name}
      </span>
    </div>
  );
}
