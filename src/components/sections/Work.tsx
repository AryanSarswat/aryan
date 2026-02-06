import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data/projects";
import ProjectCard from "../ui/ProjectCard";
import ProjectListItem from "../ui/ProjectListItem";
import ProjectPreview from "../ui/ProjectPreview";

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scroller = document.querySelector(".project-list-container");
      const items = document.querySelectorAll(".project-list-item");

      if (!scroller) return;

      items.forEach((item, index) => {
        // Focus/Active trigger - Adjusted for smaller spacers
        ScrollTrigger.create({
          trigger: item,
          scroller: scroller,
          start: "top 60%", // Activate earlier
          end: "bottom 40%", // Deactivate later
          onEnter: () => setActiveProject(index),
          onEnterBack: () => setActiveProject(index),
        });

        // Lens Effect Animation
        gsap.fromTo(item,
          { scale: 0.9, opacity: 0.4 },
          {
            scale: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: item,
              scroller: scroller,
              start: "top 80%",
              end: "top 50%",
              scrub: true,
            }
          }
        );

        gsap.to(item, {
          scale: 0.9,
          opacity: 0.4,
          scrollTrigger: {
            trigger: item,
            scroller: scroller,
            start: "bottom 50%",
            end: "bottom 20%",
            scrub: true,
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={sectionRef} className="relative py-20">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-[var(--color-accent)]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Mobile: Vertical card stack */}
      <div className="lg:hidden">
        <div className="px-6 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-center text-5xl font-black text-white sm:text-7xl tracking-tighter"
          >
            My <span className="text-white/40">Work.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center text-lg font-medium text-[var(--color-muted)]"
          >
            Selected projects showcasing my expertise
          </motion.p>
        </div>
        <div className="flex flex-col items-center gap-6 px-6 relative z-10">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>

      {/* Desktop: Split-view layout */}
      <div className="hidden min-h-[80vh] items-center justify-center lg:flex">
        {/* Split container */}
        <div className="mx-auto w-full max-w-[90rem] px-8 xl:px-12 relative z-10">
          <div className="flex flex-col">
            {/* Header: Title + Subtitle (Full Width Above Grid) */}
            <div className="max-w-4xl">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-6 text-5xl font-black text-white xl:text-8xl tracking-tighter"
              >
                My <span className="text-white/40">Work.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-12 text-xl font-medium text-[var(--color-muted)]"
              >
                Selected projects showcasing my expertise
              </motion.p>
            </div>

            {/* Content: Project List Scroller + Preview Card */}
            <div className="grid grid-cols-2 items-start gap-16 xl:gap-24">
              {/* Left: Project list with internal scroll */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-[var(--color-accent)]/20 via-transparent to-[var(--color-accent)]/20 blur-xl opacity-30" />
                <div
                  className="project-list-container relative flex h-[600px] flex-col divide-y divide-white/5 bg-black/40 glass rounded-[32px] overflow-y-auto scrollbar-hide"
                  style={{
                    maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                  }}
                >
                  {/* Top Spacer - Reduced */}
                  <div className="min-h-[100px] pointer-events-none" />

                  {projects.map((project, index) => (
                    <ProjectListItem
                      key={project.id}
                      project={project}
                      index={index}
                      isActive={activeProject === index}
                      onHover={() => setActiveProject(index)}
                    />
                  ))}

                  {/* Bottom Spacer - Reduced */}
                  <div className="min-h-[100px] pointer-events-none" />
                </div>
              </div>

              {/* Right: Preview card (sticky & centered to scroller) */}
              <div className="sticky top-[15vh]">
                <div className="flex h-[600px] items-center">
                  <div className="relative group w-full">
                    <div className="absolute -inset-4 bg-[var(--color-accent)]/10 blur-2xl rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <ProjectPreview project={projects[activeProject]} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
