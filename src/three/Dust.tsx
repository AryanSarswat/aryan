import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "./scrollState";
import { hash } from "./mathUtils";

/** Slow-drifting volumetric dust for depth and atmosphere. */
export default function Dust() {
  const ref = useRef<THREE.Points>(null);
  const count = scrollState.isMobile ? 220 : 460;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const accent = new THREE.Color("#22d3ee");
    const white = new THREE.Color("#cde9f2");
    for (let i = 0; i < count; i++) {
      const r = 4 + hash(i) * 7;
      const theta = hash(i * 1.3) * Math.PI * 2;
      const phi = Math.acos(hash(i * 2.1) * 2 - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const c = accent.clone().lerp(white, hash(i * 4.7));
      const b = 0.12 + hash(i * 5.9) * 0.3;
      colors[i * 3] = c.r * b;
      colors[i * 3 + 1] = c.g * b;
      colors[i * 3 + 2] = c.b * b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current || scrollState.reduced) return;
    ref.current.rotation.y += delta * 0.012;
    ref.current.rotation.x += delta * 0.004;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
