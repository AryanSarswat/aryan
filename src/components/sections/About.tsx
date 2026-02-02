import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center px-6 py-20"
    >
      {/* Top Transition Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--color-accent)]/5 blur-[120px] rounded-full pointer-events-none" />
      <div
        ref={contentRef}
        className="mx-auto max-w-7xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Image and Profile Card */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--color-accent)] to-[var(--color-highlight)] opacity-20 blur-2xl rounded-[40px] transition-all group-hover:opacity-30" />
            <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-[32px] border border-white/10 glass-dark">
              <img
                src="/aryan/photo.jpg"
                alt="Aryan Sarswat"
                className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
              />
              <div className="absolute bottom-6 left-6 right-6 glass-dark bg-black/60 p-6 rounded-2xl border-white/10 backdrop-blur-xl">
                <p className="text-white font-black text-xl mb-1 drop-shadow-sm">Aryan Sarswat</p>
                <p className="text-[var(--color-accent)] text-[10px] font-black tracking-[0.2em] uppercase mb-1 drop-shadow-sm">Machine Learning Scientist</p>
              </div>
            </div>
          </div>

          {/* Right: Text and Stats */}
          <div className="flex flex-col">
            <h2 className="mb-8 text-4xl font-black text-white sm:text-6xl tracking-tighter">
              Pushing the boundaries of <span className="text-white/40">Agentic AI.</span>
            </h2>

            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-muted)] sm:text-xl font-medium">
              <p>
                I'm a Machine Learning Scientist II at <span className="text-white">Expedia Group</span>, specializing in building autonomous agentic systems and Large Language Model (LLM) architectures.
              </p>
              <p>
                My passion lies at the intersection of <span className="text-[var(--color-accent)]">Deep Learning</span> and <span className="text-[var(--color-accent)]">Product Engineering</span>—transforming state-of-the-art research into scalable, real-world impact.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              {[
                { label: "Experience", value: "5+ Years", sub: "in ML/AI" },
                { label: "Focus", value: "Generative AI", sub: "LLMs & Agents" },
              ].map((stat, i) => (
                <div key={i} className="glass p-8 rounded-2xl border-white/5 hover:border-[var(--color-accent)]/30 transition-all hover:bg-white/5">
                  <p className="text-[var(--color-muted)] text-[10px] font-black uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                  <p className="text-3xl font-black text-white mb-2">{stat.value}</p>
                  <p className="text-xs text-[var(--color-muted)]/60 font-bold">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
