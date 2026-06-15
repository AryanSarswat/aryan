import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { scrollState, type SetPiece } from "./scrollState";
import HeroScene from "./scenes/HeroScene";
import WorkScene from "./scenes/WorkScene";
import CareerScene from "./scenes/CareerScene";

/**
 * Fixed, transparent WebGL canvas that hosts the 3D "set pieces".
 *
 * Only one scene is mounted at a time — the one named by `scrollState.active`.
 * During calm sections `active` is null: the scene unmounts, the canvas fades
 * out (CSS), and the render loop is paused (`frameloop="never"`) so the GPU
 * idles while the visitor reads. `active` is a mutable value, so a tiny rAF
 * mirrors it into React state only when it actually changes (a few times per
 * full scroll) — per-frame motion still flows through `scrollState`.
 */
export default function SetPieceCanvas() {
  const mobile = scrollState.isMobile;
  const [active, setActive] = useState<SetPiece | null>(scrollState.active);
  const activeRef = useRef(active);

  useEffect(() => {
    let alive = true;
    let raf = 0;
    const tick = () => {
      if (!alive) return;
      if (scrollState.active !== activeRef.current) {
        activeRef.current = scrollState.active;
        setActive(scrollState.active);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Canvas
      className="setpiece-canvas"
      data-active={active !== null}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
      dpr={[1, mobile ? 1.4 : 1.8]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7], fov: 45 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <fog attach="fog" args={["#0a0b0d", 8, 22]} />
      <ambientLight intensity={0.55} color="#9fd9e6" />
      <directionalLight position={[4, 6, 6]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-6, -3, 2]} intensity={12} distance={24} decay={1.6} color="#0e7490" />

      <Suspense fallback={null}>
        {active === "hero" && <HeroScene />}
        {active === "work" && <WorkScene />}
        {active === "career" && <CareerScene />}
      </Suspense>
    </Canvas>
  );
}
