import { useCallback, useEffect, useState } from "react";
import SetPieceCanvas from "./three/SetPieceCanvas";
import JourneyController from "./three/JourneyController";
import Nav from "./components/ui/Nav";
import ProgressRail from "./components/ui/ProgressRail";
import SocialRail from "./components/ui/SocialRail";
import ArticleOverlay from "./components/ui/ArticleOverlay";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Writing from "./components/sections/Writing";
import Work from "./components/sections/Work";
import Career from "./components/sections/Career";
import Contact from "./components/sections/Contact";
import { JOURNEY } from "./data/journey";
import { MOBILE_BREAKPOINT } from "./data/config";
import { scrollState } from "./three/scrollState";
import { useReveal } from "./hooks/useReveal";
import { useActiveSection } from "./hooks/useActiveSection";

const IDS = JOURNEY.map((s) => s.id);

export default function App() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(() => scrollState.isMobile);
  useReveal();
  const active = useActiveSection(IDS);

  // Rebuild the WebGL scene and the pinned Work layout when crossing the mobile
  // breakpoint, so particle density / DPR / pin-vs-native match the viewport
  // class even if the window is resized across it mid-session.
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      scrollState.isMobile = mobile;
      setIsMobile((prev) => (prev === mobile ? prev : mobile));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeOverlay = useCallback(() => setOpenSlug(null), []);
  const layoutKey = isMobile ? "mobile" : "desktop";

  return (
    <>
      {/* Fixed WebGL layer (z-index -1) + atmosphere veil (z-index 0) */}
      <SetPieceCanvas key={layoutKey} />
      <div className="atmosphere" />
      <JourneyController />

      {/* Chrome */}
      <Nav active={active} />
      <ProgressRail active={active} />
      <SocialRail />

      {/* Scrollable HTML overlay */}
      <main className="app-shell">
        <Hero />
        <About />
        <Writing onOpen={setOpenSlug} />
        <Work key={`work-${layoutKey}`} />
        <Career key={`career-${layoutKey}`} />
        <Contact />
      </main>

      <ArticleOverlay slug={openSlug} onClose={closeOverlay} />
    </>
  );
}
