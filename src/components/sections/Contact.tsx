import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { FiMail, FiGithub, FiLinkedin, FiFileText } from "react-icons/fi";

interface ContactLink {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: typeof FiMail;
  color: string;
  x: number;
  y: number;
}

const contactLinks: ContactLink[] = [
  {
    id: "resume",
    label: "Download",
    value: "Resume.pdf",
    href: "/aryan/resume.pdf",
    icon: FiFileText,
    color: "#a855f7",
    x: 0,
    y: -120,
  },
  {
    id: "email",
    label: "Email",
    value: "aryansarswat2000@gmail.com",
    href: "mailto:aryansarswat2000@gmail.com",
    icon: FiMail,
    color: "#EA4335",
    x: -120,
    y: 0,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "aryan-sarswat",
    href: "https://linkedin.com/in/aryan-sarswat",
    icon: FiLinkedin,
    color: "#0A66C2",
    x: 120,
    y: 0,
  },
  {
    id: "github",
    label: "GitHub",
    value: "AryanSarswat",
    href: "https://github.com/AryanSarswat",
    icon: FiGithub,
    color: "#FFFFFF",
    x: 0,
    y: 120,
  },
];

// SVG Icon component
function SvgIcon({
  icon: Icon,
  x,
  y,
  size,
  color,
  isHovered,
  label,
  href,
  isResume,
  tooltipBelow = false,
  onFocus,
  onBlur,
}: {
  icon: typeof FiMail;
  x: number;
  y: number;
  size: number;
  color: string;
  isHovered: boolean;
  label: string;
  href: string;
  isResume: boolean;
  tooltipBelow?: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Glow circle */}
      <motion.circle
        r={size / 2 + 8}
        fill={color + "10"}
        stroke={color + "50"}
        strokeWidth="1"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{
          scale: isHovered ? 1.15 : 1,
          opacity: isHovered ? 1 : 0.5,
        }}
        transition={{ duration: 0.2 }}
        style={{
          filter: isHovered ? `drop-shadow(0 0 12px ${color}60)` : `drop-shadow(0 0 4px ${color}30)`
        }}
      />

      {/* Link area */}
      <a
        href={href}
        target={isResume || label === "Email" ? undefined : "_blank"}
        rel="noopener noreferrer"
        download={isResume}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <foreignObject x={-size / 2} y={-size / 2} width={size} height={size}>
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ color: isHovered ? color : 'rgba(255,255,255,0.8)' }}
          >
            <Icon
              width={isResume ? size * 0.5 : size * 0.45}
              height={isResume ? size * 0.5 : size * 0.45}
              className="transition-colors duration-200"
            />
          </div>
        </foreignObject>
      </a>

      {/* Tooltip */}
      {isHovered && (
        <g transform={`translate(0, ${tooltipBelow ? size / 2 + 30 : -(size / 2 + 30)})`}>
          <motion.rect
            x={-35}
            y={-12}
            width={70}
            height={20}
            rx="4"
            fill="rgba(255,255,255,0.1)"
            stroke={color + "40"}
            initial={{ opacity: 0, y: tooltipBelow ? -5 : 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          />
          <text
            textAnchor="middle"
            y={4}
            fill="white"
            fontSize="9"
            fontWeight="600"
            style={{ pointerEvents: "none" }}
          >
            {label}
          </text>
        </g>
      )}

      {/* Permanent RESUME label */}
      {isResume && !isHovered && (
        <g transform={`translate(0, ${size / 2 + 12})`}>
          <text
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize="7"
            fontWeight="500"
            letterSpacing="2"
          >
            RESUME
          </text>
        </g>
      )}
    </g>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const resume = contactLinks[0];
  const email = contactLinks[1];
  const linkedin = contactLinks[2];
  const github = contactLinks[3];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-40"
    >
      {/* Top Transition Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--color-accent)]/5 blur-[120px] rounded-full pointer-events-none" />
      <div ref={contentRef} className="relative mx-auto w-full max-w-xl flex flex-col items-center">
        <div className="mb-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-5xl font-black text-white sm:text-7xl tracking-tighter"
          >
            Get In <span className="text-white/40">Touch.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-lg text-lg font-medium text-[var(--color-muted)] sm:text-xl"
          >
            I'm always open to discussing new opportunities, interesting projects,
            or just having a chat about ML and AI.
          </motion.p>
        </div>

        <div className="relative mx-auto flex h-[320px] w-[320px] items-center justify-center">
          <svg
            viewBox="0 0 360 360"
            className="h-full w-full"
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(168, 85, 247, 0.2)" />
                <stop offset="50%" stopColor="rgba(168, 85, 247, 0.6)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.2)" />
              </linearGradient>
            </defs>

            {/* Diamond connections */}
            <motion.line
              x1={180 + resume.x} y1={180 + resume.y}
              x2={180 + email.x} y2={180 + email.y}
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{ filter: "drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))" }}
            />
            <motion.line
              x1={180 + email.x} y1={180 + email.y}
              x2={180 + github.x} y2={180 + github.y}
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 1, delay: 0.6 }}
              style={{ filter: "drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))" }}
            />
            <motion.line
              x1={180 + github.x} y1={180 + github.y}
              x2={180 + linkedin.x} y2={180 + linkedin.y}
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 1, delay: 0.8 }}
              style={{ filter: "drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))" }}
            />
            <motion.line
              x1={180 + linkedin.x} y1={180 + linkedin.y}
              x2={180 + resume.x} y2={180 + resume.y}
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 1, delay: 1 }}
              style={{ filter: "drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))" }}
            />
            <motion.line
              x1={180 + email.x} y1={180 + email.y}
              x2={180 + linkedin.x} y2={180 + linkedin.y}
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 1, delay: 1.2 }}
              style={{ filter: "drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))" }}
            />

            {/* Center pulse */}
            <motion.circle
              cx="180"
              cy="180"
              r="3"
              fill="var(--color-accent)"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.8, 0.3, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Icon nodes */}
            {contactLinks.map((link) => (
              <motion.g
                key={link.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onMouseEnter={() => setHoveredId(link.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <SvgIcon
                  icon={link.icon}
                  x={180 + link.x}
                  y={180 + link.y}
                  size={link.id === "resume" ? 48 : 40}
                  color={link.color}
                  isHovered={hoveredId === link.id}
                  label={link.label}
                  href={link.href}
                  isResume={link.id === "resume"}
                  tooltipBelow={link.id === "resume"}
                  onFocus={() => setHoveredId(link.id)}
                  onBlur={() => setHoveredId(null)}
                />
              </motion.g>
            ))}
          </svg>
        </div>

      </div>
    </section>
  );
}
