import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "./scrollState";
import NodeNetwork from "./NodeNetwork";
import Dust from "./Dust";
import CursorLight from "./CursorLight";

/**
 * Fixed, transparent WebGL canvas that lives behind the scrollable HTML overlay
 * (z-index -1). All scene reactions are driven from `scrollState`, so the canvas
 * itself never re-renders on scroll.
 */
export default function Scene() {
  const mobile = scrollState.isMobile;

  return (
    <Canvas
      className="scene-canvas"
      // Inline style overrides R3F's default container position/size so the
      // canvas truly fills the viewport behind the scrolling overlay.
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
      dpr={[1, mobile ? 1.4 : 1.8]}
      gl={{
        antialias: !mobile,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <fog attach="fog" args={["#0a0b0d", 6, 16]} />

      {/* Studio lighting: ambient base, directional key, cool fill, cursor spot */}
      <ambientLight intensity={0.5} color="#9fd9e6" />
      <directionalLight position={[4, 6, 6]} intensity={1.3} color="#ffffff" />
      <pointLight position={[-6, -3, 2]} intensity={14} distance={22} decay={1.6} color="#0e7490" />
      <CursorLight />

      <NodeNetwork />
      <Dust />
    </Canvas>
  );
}

// Ensure consistent colour handling across three versions.
THREE.ColorManagement.enabled = true;
