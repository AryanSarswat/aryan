import { lazy, Suspense } from "react";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Career from "./components/sections/Career";
import Work from "./components/sections/Work";
import Hobbies from "./components/sections/Hobbies";
import Musings from "./components/sections/Musings";
import Contact from "./components/sections/Contact";
import Navbar from "./components/layout/Navbar";

const TechStack = lazy(() => import("./components/sections/TechStack"));

export default function App() {
  return (
    <div className="relative min-h-screen bg-[var(--color-background)] selection:bg-[var(--color-accent)] selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#3b0764,transparent_70%)] opacity-30" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <header>
        <Navbar />
      </header>

      <main className="relative z-10">
        <section id="hero">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="experience">
          <Career />
        </section>
        <section id="work">
          <Work />
        </section>
        <section id="skills">
          <Suspense fallback={<div className="flex items-center justify-center py-20 min-h-[400px]" />}>
            <TechStack />
          </Suspense>
        </section>
        <section id="musings">
          <Musings />
        </section>
        <section id="hobbies">
          <Hobbies />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-6 text-center">
        <p className="mb-1 text-sm text-[var(--color-muted)]">
          Designed &amp; Built by Aryan Sarswat
        </p>
        <p className="text-xs text-[var(--color-muted)]/50">
          &copy; {new Date().getFullYear()} All rights reserved
        </p>
      </footer>
    </div>
  );
}
