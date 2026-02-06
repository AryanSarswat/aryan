import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { experiences } from "../../data/experiences";

const parseYear = (yearStr: string): number => {
  if (yearStr.toLowerCase().includes("present") || yearStr.toLowerCase().includes("now")) {
    return new Date().getFullYear() + 1;
  }
  const parts = yearStr.split("-");
  const endYear = parts[parts.length - 1].trim();
  return parseInt(endYear, 10) || 0;
};

const getDisplayYear = (yearStr: string): string => {
  if (yearStr.toLowerCase().includes("present")) return "Now";
  const parts = yearStr.split("-");
  return parts[parts.length - 1].trim();
};

interface Experience {
  company: string;
  title: string;
  year: string;
  description: string;
  category: string;
}

export default function Career() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const sortedExperiences = useMemo(() => {
    return [...experiences].sort((a, b) => {
      const yearA = parseYear(a.year);
      const yearB = parseYear(b.year);
      if (yearA !== yearB) return yearB - yearA;
      if (a.category === "Education" && b.category !== "Education") return -1;
      if (b.category === "Education" && a.category !== "Education") return 1;
      return 0;
    });
  }, []) as Experience[];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = timelineRef.current?.querySelectorAll(".timeline-item");
      if (!items) return;

      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: item,
              start: "top 95%",
              end: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );

        ScrollTrigger.create({
          trigger: item,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [sortedExperiences]);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 py-20"
    >
      {/* Top Transition Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--color-highlight)]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="mx-auto max-w-[1400px]">
        <h2 className="mb-20 text-center text-4xl font-black tracking-tighter text-white sm:text-7xl md:text-8xl">
          Career <span className="text-white/20">&</span> Experience
        </h2>

        <div ref={timelineRef} className="relative">
          {/* Vertical axis line - Perfectly Centered on Desktop */}
          <div
            className="absolute left-[27px] top-0 h-full w-[1px] md:left-1/2 md:-translate-x-1/2"
            style={{
              background: "linear-gradient(to bottom, transparent, var(--color-accent) 20%, var(--color-highlight) 80%, transparent)",
              opacity: 0.2
            }}
          />

          {sortedExperiences.map((exp: Experience, index: number) => {
            const isEven = index % 2 === 0;
            const isActive = activeIndex === index;

            return (
              <div
                key={`${exp.company}-${index}`}
                className="timeline-item group relative mb-32 grid grid-cols-[54px_1fr] gap-0 md:grid-cols-[1fr_160px_1fr]"
              >
                {/* Desktop Left Column */}
                <div
                  className={`hidden md:flex flex-col items-end justify-center px-12 text-right transition-all duration-700 ${!isEven ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                >
                  <ExperienceContent exp={exp} isActive={isActive} side="left" />
                </div>

                {/* Center Column (Fixed width for Dot) */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`z-20 flex h-14 w-14 items-center justify-center rounded-full border bg-[var(--color-background)] text-xs font-black tracking-tighter transition-all duration-700 ${isActive
                      ? "border-[var(--color-accent)] text-[var(--color-accent)] shadow-[0_0_50px_-5px_var(--color-accent)] scale-125"
                      : "border-white/10 text-white/20"
                      }`}
                  >
                    {getDisplayYear(exp.year)}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[var(--color-accent)]/10 blur-3xl rounded-full"
                    />
                  )}
                </div>

                {/* Desktop Right Column / Mobile Content Column */}
                <div
                  className={`flex flex-col justify-center pl-8 md:px-12 text-left transition-all duration-700 ${isEven ? "md:opacity-0 md:pointer-events-none" : "opacity-100"
                    }`}
                >
                  <ExperienceContent exp={exp} isActive={isActive} side="right" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExperienceContent({ exp, isActive, side }: { exp: Experience, isActive: boolean, side: 'left' | 'right' }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && contentRef.current) {
      const children = Array.from(contentRef.current.children);
      gsap.fromTo(
        children,
        {
          opacity: 0,
          x: side === 'left' ? 40 : -40,
          y: 20
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          overwrite: true
        }
      );
    }
  }, [isActive, side]);

  return (
    <div
      ref={contentRef}
      className={`max-w-xl py-4 ${isActive ? "opacity-100" : "opacity-0 invisible"}`}
    >
      <div className="mb-4">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
          {exp.category}
        </span>
      </div>

      <h3 className="mb-4 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl tracking-tighter">
        {exp.title}
      </h3>

      <p className="mb-8 text-xl font-bold text-[var(--color-accent)]">
        {exp.company}
      </p>

      <div className="p-6 rounded-2xl border border-white/5 glass-dark">
        <p className="text-lg leading-relaxed text-[var(--color-muted)] font-medium">
          {exp.description}
        </p>
      </div>
    </div>
  );
}
