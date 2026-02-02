import TechGlobe from "../ui/TechGlobe";

export default function TechStack() {
  return (
    <section id="skills" className="relative flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Top Transition Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--color-highlight)]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Bottom Decorative Blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--color-accent)]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto w-full max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="mb-6 text-5xl font-black text-white sm:text-7xl tracking-tighter">
            The <span className="text-white/40">Technical</span> Toolkit.
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-medium text-[var(--color-muted)] sm:text-xl">
            A curated selection of technologies and frameworks I use to bring complex AI systems to life.
          </p>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5">
          <TechGlobe />
        </div>
      </div>
    </section>
  );
}
