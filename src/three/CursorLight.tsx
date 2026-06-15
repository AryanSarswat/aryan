import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "./scrollState";

/** A subtle accent-coloured point light that trails the cursor. */
export default function CursorLight() {
  const ref = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!ref.current) return;
    const tx = scrollState.reduced ? 0 : scrollState.mouseX * 4.5;
    const ty = scrollState.reduced ? 1 : scrollState.mouseY * 3;
    ref.current.position.x += (tx - ref.current.position.x) * 0.08;
    ref.current.position.y += (ty - ref.current.position.y) * 0.08;
  });

  return (
    <pointLight
      ref={ref}
      position={[0, 1, 4]}
      color="#22d3ee"
      intensity={scrollState.isMobile ? 6 : 12}
      distance={14}
      decay={1.4}
    />
  );
}
