import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "../scrollState";
import { clamp, lerp, smoothstep, hash } from "../mathUtils";
import { experiences } from "../../data/experiences";

// ── Constants ──────────────────────────────────────────────────────────────────
const N = experiences.length; // 6
const STEP = 1.7;
const TOP_Y = ((N - 1) / 2) * STEP; // timeline centered on origin
const PARTICLE_COUNT = 80;
const CAMERA_Z = 6.5;
const REDUCED_Z = 11; // pull back enough to see all nodes at once

// Node Y position for index i (0 = top / most recent)
function nodeY(i: number): number {
  return TOP_Y - i * STEP;
}

// ── Glow texture (radial gradient, reused across halos) ──────────────────────
function makeGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(103, 232, 249, 0.95)");
  g.addColorStop(0.3, "rgba(34, 211, 238, 0.55)");
  g.addColorStop(1, "rgba(34, 211, 238, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ── Sub-component: vertical beam (thin emissive cylinder) ────────────────────
function Beam(): JSX.Element {
  const height = (N - 1) * STEP;
  return (
    <mesh frustumCulled={false}>
      <cylinderGeometry args={[0.012, 0.012, height, 6, 1]} />
      <meshBasicMaterial
        color="#22d3ee"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Sub-component: drifting particles near the beam ──────────────────────────
function BeamParticles(): JSX.Element {
  const posAttr = useRef<THREE.BufferAttribute>(null);

  const { positions, seeds } = useMemo<{
    positions: Float32Array;
    seeds: Float32Array;
  }>(() => {
    const p = new Float32Array(PARTICLE_COUNT * 3);
    const s = new Float32Array(PARTICLE_COUNT);
    const totalHeight = (N - 1) * STEP;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = hash(i);
      p[i * 3] = (hash(i * 2.3) - 0.5) * 0.6;
      p[i * 3 + 1] = TOP_Y - t * totalHeight;
      p[i * 3 + 2] = (hash(i * 4.7) - 0.5) * 0.6;
      s[i] = hash(i * 7.1) * 6.28;
    }
    return { positions: p, seeds: s };
  }, []);

  useFrame(({ clock }) => {
    if (!posAttr.current || scrollState.reduced) return;
    const t = clock.elapsedTime;
    const arr = posAttr.current.array as Float32Array;
    const totalHeight = (N - 1) * STEP;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phase = seeds[i];
      const drift = 0.08 * Math.sin(t * 0.6 + phase);
      const baseY = TOP_Y - ((seeds[i] / 6.28) * totalHeight + (t * 0.12) % totalHeight);
      arr[i * 3] = (hash(i * 2.3) - 0.5) * 0.6 + drift;
      arr[i * 3 + 1] = ((baseY - TOP_Y + totalHeight) % totalHeight - totalHeight / 2) * -1 +
        (Math.sin(t * 0.3 + phase) * 0.1);
      arr[i * 3 + 2] = (hash(i * 4.7) - 0.5) * 0.6 + drift * 0.5;
    }
    posAttr.current.needsUpdate = true;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          ref={posAttr}
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        color="#22d3ee"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ── Main scene ────────────────────────────────────────────────────────────────
export default function CareerScene(): JSX.Element {
  const camera = useThree((s) => s.camera);
  const glowTex = useMemo(makeGlowTexture, []);
  useEffect(() => () => glowTex.dispose(), [glowTex]);

  // Per-node refs for geometry instancing
  const nodeRefs = useRef<(THREE.Mesh | null)[]>(Array(N).fill(null));
  const haloRefs = useRef<(THREE.Sprite | null)[]>(Array(N).fill(null));

  // Scratch objects — allocated once, reused every frame
  const camTarget = useRef(new THREE.Vector3());
  const prevIndex = useRef(-1);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.elapsedTime;
    const reduced = scrollState.reduced;

    // ── Camera travel ────────────────────────────────────────────────────────
    if (reduced) {
      // Static: frame all nodes
      camera.position.y = lerp(camera.position.y, 0, 1 - Math.pow(0.01, dt));
      camera.position.z = lerp(camera.position.z, REDUCED_Z, 1 - Math.pow(0.01, dt));
    } else {
      const travel = clamp(scrollState.careerTravel, 0, 1);
      const targetY = TOP_Y - travel * ((N - 1) * STEP);
      const mx = scrollState.mouseX;
      const my = scrollState.mouseY;
      const ease = 1 - Math.pow(0.008, dt);
      camera.position.y = lerp(camera.position.y, targetY + my * -0.3, ease);
      camera.position.x = lerp(camera.position.x, mx * 0.4, ease);
      camera.position.z = lerp(camera.position.z, CAMERA_Z, ease);
    }

    // Look at the point directly ahead (same y as camera, at origin x/z)
    camTarget.current.set(0, camera.position.y, 0);
    camera.lookAt(camTarget.current);

    // ── Node emphasis ────────────────────────────────────────────────────────
    const activeIdx = clamp(Math.round(scrollState.careerIndex), 0, N - 1);
    const indexChanged = activeIdx !== prevIndex.current;
    prevIndex.current = activeIdx;

    for (let i = 0; i < N; i++) {
      const mesh = nodeRefs.current[i];
      const halo = haloRefs.current[i];
      if (!mesh) continue;

      const dist = Math.abs(i - activeIdx);
      const proximity = smoothstep(clamp(1 - dist * 0.9, 0, 1));

      // Scale: active pops up, others recede
      const targetScale = reduced
        ? 0.13
        : lerp(0.08, 0.18, proximity) + (proximity > 0.9 ? 0.04 * Math.sin(t * 2.4) : 0);
      const currentScale = mesh.scale.x;
      mesh.scale.setScalar(lerp(currentScale, targetScale, 1 - Math.pow(0.01, dt)));

      // Emissive intensity
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const targetEmissive = reduced ? 1.2 : lerp(0.5, 2.4, proximity);
      mat.emissiveIntensity = lerp(mat.emissiveIntensity, targetEmissive, 1 - Math.pow(0.02, dt));
      mat.opacity = reduced ? 0.9 : lerp(0.45, 1.0, proximity);

      // Idle drift: gentle horizontal bob
      if (!reduced) {
        const driftAmp = 0.025 * (1 - proximity);
        mesh.position.x = Math.sin(t * 0.5 + i * 1.3) * driftAmp;
        mesh.position.z = Math.cos(t * 0.4 + i * 0.9) * driftAmp;
      } else {
        mesh.position.x = 0;
        mesh.position.z = 0;
      }

      // Halo sprite
      if (halo) {
        const haloMat = halo.material as THREE.SpriteMaterial;
        const targetOpacity = reduced ? 0.3 : lerp(0.05, 0.75, proximity);
        haloMat.opacity = lerp(haloMat.opacity, targetOpacity, 1 - Math.pow(0.02, dt));
        const pulse = 1 + (proximity > 0.9 && !reduced ? 0.18 * Math.sin(t * 2.4) : 0);
        const haloScale = lerp(0.25, 0.65, proximity) * pulse;
        halo.scale.setScalar(haloScale);
      }

      // Brief tick burst: scale spike on index change for active node
      if (indexChanged && i === activeIdx && !reduced) {
        mesh.scale.setScalar(0.26);
      }
    }
  });

  return (
    <group>
      <Beam />
      <BeamParticles />

      {experiences.map((_, i) => {
        const y = nodeY(i);
        return (
          <group key={i} position={[0, y, 0]}>
            {/* Core node sphere */}
            <mesh
              ref={(el) => { nodeRefs.current[i] = el; }}
              frustumCulled={false}
            >
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial
                color="#0b2c33"
                emissive="#22d3ee"
                emissiveIntensity={1.2}
                metalness={0.5}
                roughness={0.3}
                transparent
                opacity={0.85}
              />
            </mesh>

            {/* Additive halo sprite */}
            <sprite
              ref={(el) => { haloRefs.current[i] = el; }}
              scale={0.35}
            >
              <spriteMaterial
                map={glowTex}
                transparent
                opacity={0.25}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          </group>
        );
      })}
    </group>
  );
}
