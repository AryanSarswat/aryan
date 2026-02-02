import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        nameRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      )
        .fromTo(
          titleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.3"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-accent)]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center flex flex-col items-center gap-24 sm:gap-32">
        <h1
          ref={nameRef}
          className="text-6xl font-black tracking-tighter text-white sm:text-8xl md:text-9xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-tight"
        >
          Aryan Sarswat
        </h1>
        <div className="overflow-hidden py-4">
          <p
            ref={titleRef}
            className="text-lg font-medium tracking-[0.2em] uppercase text-[var(--color-accent)] sm:text-xl md:text-3xl text-center"
          >
            ML Scientist | Gym Rat | Adrenaline Junkie
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="absolute bottom-12 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--color-muted)] font-bold">
          Scroll to explore
        </span>
        <div className="h-12 w-[1px] bg-gradient-to-b from-[var(--color-accent)] to-transparent animate-bounce-slow" />
      </div>
    </section>
  );
}
