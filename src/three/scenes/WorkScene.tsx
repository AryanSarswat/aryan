import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { projects } from "../../data/projects";
import { scrollState } from "../scrollState";
import { lerp, smoothstep, clamp } from "../mathUtils";

// ── Constants ─────────────────────────────────────────────────────────────────
const N = projects.length; // 6
const SPACING = 4.0;
const CARD_W = 3.2;
const CARD_H = 2.0;
const FRAME_W = CARD_W + 0.08;
const FRAME_H = CARD_H + 0.08;
const CAM_Z = 6.5;
const EMPHASIS_SCALE = 1.12;
const RECEDE_Z = -0.45;

// x position for card i
const cardX = (i: number): number => (i - (N - 1) / 2) * SPACING;

// 1×1 transparent PNG — a valid URL so useLoader never rejects (which would throw
// past Suspense with no error boundary) if a project ever lacks an image.
const BLANK_PX =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC";
const imageUrls: string[] = projects.map((p) => p.image ?? BLANK_PX);

// ── Component ─────────────────────────────────────────────────────────────────
export default function WorkScene(): JSX.Element {
  const camera = useThree((s) => s.camera);

  // useLoader caches textures for the app lifetime. This scene mounts/unmounts
  // every time Work scrolls in and out, so we must NOT dispose them on unmount —
  // that would blank the cached textures on the next visit.
  const textures = useLoader(THREE.TextureLoader, imageUrls);

  useEffect(() => {
    textures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    });
  }, [textures]);

  // ── Geometries (stable refs) ───────────────────────────────────────────────
  const { cardGeo, frameGeo } = useMemo(() => {
    const cg = new THREE.PlaneGeometry(CARD_W, CARD_H);
    const fg = new THREE.PlaneGeometry(FRAME_W, FRAME_H);
    return { cardGeo: cg, frameGeo: fg };
  }, []);

  useEffect(() => {
    return () => {
      cardGeo.dispose();
      frameGeo.dispose();
    };
  }, [cardGeo, frameGeo]);

  // ── Per-card refs ──────────────────────────────────────────────────────────
  const cardRefs = useRef<(THREE.Mesh | null)[]>([]);
  const frameRefs = useRef<(THREE.Mesh | null)[]>([]);
  const cardMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const frameMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  // Scratch objects — allocated once, reused every frame.
  const scratchVec = useMemo(() => new THREE.Vector3(), []);

  // ── Frame loop ─────────────────────────────────────────────────────────────
  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.elapsedTime;
    const reduced = scrollState.reduced;

    // Derive active index from workPan.
    const pan = scrollState.workPan; // 0 → 1
    const activeFrac = pan * (N - 1); // 0 → 5
    const activeIdx = Math.round(activeFrac);

    // Camera dolly: ease toward the active card's X, folding mouse parallax into
    // the target so it can't accumulate into steady-state overshoot.
    const targetX = cardX(activeIdx);
    if (reduced) {
      camera.position.set((cardX(0) + cardX(N - 1)) / 2, 0, CAM_Z);
    } else {
      const easeK = 1 - Math.pow(0.02, dt);
      camera.position.x = lerp(camera.position.x, targetX + scrollState.mouseX * 0.12, easeK);
      camera.position.y = lerp(camera.position.y, scrollState.mouseY * 0.18, easeK);
      camera.position.z = CAM_Z;
    }
    // Look straight at the active card (uses the final, post-parallax position).
    scratchVec.set(camera.position.x, 0, 0);
    camera.lookAt(scratchVec);

    // Update each card.
    for (let i = 0; i < N; i++) {
      const card = cardRefs.current[i];
      const frame = frameRefs.current[i];
      const cardMat = cardMats.current[i];
      const frameMat = frameMats.current[i];
      if (!card || !frame || !cardMat || !frameMat) continue;

      // Distance from active (0 = active card, 1 = one step away, …).
      const dist = Math.abs(i - activeFrac);
      // emphasis: 1 at center, 0 at dist=1.5+
      const emphasis = smoothstep(clamp(1.5 - dist, 0, 1));

      // Target transform.
      const baseX = cardX(i);
      const targetZ = reduced ? 0 : lerp(RECEDE_Z, 0, emphasis);
      // Idle float.
      const floatY = reduced ? 0 : 0.06 * Math.sin(t * 0.7 + i * 1.3);
      // Tilt toward center for non-active cards.
      const tiltDir = i < activeFrac ? 1 : -1;
      const tiltAmt = reduced ? 0 : lerp(0.08, 0, emphasis) * tiltDir;

      const targetScale = lerp(1.0, EMPHASIS_SCALE, emphasis);

      card.position.set(baseX, floatY, targetZ);
      card.rotation.y = tiltAmt;
      card.scale.setScalar(targetScale);

      frame.position.set(baseX, floatY, targetZ - 0.001);
      frame.rotation.y = tiltAmt;
      frame.scale.setScalar(targetScale);

      // Material brightness.
      cardMat.opacity = lerp(0.55, 1.0, emphasis);
      cardMat.emissiveIntensity = lerp(0.0, 0.08, emphasis);

      const frameOpacity = lerp(0.45, 1.0, emphasis);
      frameMat.opacity = frameOpacity;
    }
  });

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <group>
      {projects.map((project, i) => (
        <group key={project.id}>
          {/* Emissive cyan frame — slightly larger plane behind the card */}
          <mesh
            ref={(el) => { frameRefs.current[i] = el; }}
            geometry={frameGeo}
            position={[cardX(i), 0, -0.001]}
            frustumCulled={false}
          >
            <meshBasicMaterial
              ref={(el) => { frameMats.current[i] = el; }}
              color="#22d3ee"
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.FrontSide}
            />
          </mesh>

          {/* Card face */}
          <mesh
            ref={(el) => { cardRefs.current[i] = el; }}
            geometry={cardGeo}
            position={[cardX(i), 0, 0]}
            frustumCulled={false}
          >
            <meshStandardMaterial
              ref={(el) => { cardMats.current[i] = el as THREE.MeshStandardMaterial | null; }}
              map={textures[i]}
              emissive="#22d3ee"
              emissiveIntensity={0.05}
              metalness={0.1}
              roughness={0.75}
              transparent
              opacity={1.0}
              side={THREE.FrontSide}
            />
          </mesh>
        </group>
      ))}

      {/* Subtle fill light to give cards some depth variation */}
      <pointLight position={[0, 0, 4]} intensity={0.6} color="#cde9f2" />
    </group>
  );
}
