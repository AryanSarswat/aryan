import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "../scrollState";
import { clamp, lerp, smoothstep, hash, PHI } from "../mathUtils";

/**
 * Hero section constellation: fibonacci-sphere node network with line segments,
 * slow spin, cursor parallax, and a smooth handoff fade as heroExit → 1.
 */
export default function HeroScene() {
  const mobile = scrollState.isMobile;
  const N = mobile ? 70 : 140;
  const NODE_SIZE = mobile ? 0.046 : 0.04;
  const R = 2.4;

  const camera = useThree((s) => s.camera);

  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const lineAttrRef = useRef<THREE.BufferAttribute>(null);
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);
  const nodeMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const spin = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // ── Precompute fibonacci-sphere node directions + size multipliers ──────────
  const nodeData = useMemo(() => {
    const dir = new Float32Array(N * 3);
    const radii = new Float32Array(N);
    const sizeMul = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = PHI * i;
      dir[i * 3] = Math.cos(theta) * r;
      dir[i * 3 + 1] = y;
      dir[i * 3 + 2] = Math.sin(theta) * r;
      radii[i] = 0.88 + hash(i) * 0.24;
      sizeMul[i] = 0.65 + hash(i * 3.3) * 0.85;
    }

    // Connect each node to its two nearest neighbours (deduped).
    const pairSet = new Set<string>();
    const pairs: number[] = [];
    for (let i = 0; i < N; i++) {
      let n1 = -1, n2 = -1, d1 = Infinity, d2 = Infinity;
      const ix = dir[i * 3], iy = dir[i * 3 + 1], iz = dir[i * 3 + 2];
      for (let j = 0; j < N; j++) {
        if (j === i) continue;
        const dx = ix - dir[j * 3];
        const dy = iy - dir[j * 3 + 1];
        const dz = iz - dir[j * 3 + 2];
        const d = dx * dx + dy * dy + dz * dz;
        if (d < d1) { d2 = d1; n2 = n1; d1 = d; n1 = j; }
        else if (d < d2) { d2 = d; n2 = j; }
      }
      for (const nb of [n1, n2]) {
        if (nb < 0) continue;
        const key = i < nb ? `${i}_${nb}` : `${nb}_${i}`;
        if (!pairSet.has(key)) { pairSet.add(key); pairs.push(i, nb); }
      }
    }

    return { dir, radii, sizeMul, pairs };
  }, [N]);

  // Scratch typed arrays — reused each frame, never reallocated.
  const nodePos = useMemo(() => new Float32Array(N * 3), [N]);
  const linePositions = useMemo(
    () => new Float32Array(nodeData.pairs.length * 3),
    [nodeData.pairs.length]
  );

  // Restore camera near-position on mount; no teardown needed (parent canvas owns camera).
  useEffect(() => {
    camera.position.set(0, 0, 7);
  }, [camera]);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.elapsedTime;
    const reduced = scrollState.reduced;

    // heroExit is 0 at top of hero, rises to 1 when scrolled fully past.
    const exit = clamp(scrollState.heroExit, 0, 1);
    // Smooth the fade so it eases in and finishes decisively.
    const fadeOut = smoothstep(exit);

    // ── Camera parallax (gentle) ───────────────────────────────────────────────
    if (!reduced) {
      const mx = scrollState.mouseX;
      const my = scrollState.mouseY;
      camera.position.x += (mx * 0.25 - camera.position.x) * 0.06;
      camera.position.y += (-my * 0.18 - camera.position.y) * 0.06;
    } else {
      camera.position.x += (0 - camera.position.x) * 0.1;
      camera.position.y += (0 - camera.position.y) * 0.1;
    }

    // ── Group transform: spin + mouse parallax + heroExit recession ───────────
    const g = groupRef.current;
    if (g) {
      const mx = reduced ? 0 : scrollState.mouseX;
      const my = reduced ? 0 : scrollState.mouseY;

      if (!reduced) spin.current += dt * 0.14;

      // Recede in z and shrink as exit progresses.
      const scaleTarget = lerp(1.0, 0.82, fadeOut);
      const zOffset = lerp(0, -1.2, fadeOut);

      g.position.set(mx * 0.12, -my * 0.08, zOffset);
      g.scale.setScalar(scaleTarget);
      g.rotation.y = spin.current + mx * 0.35;
      g.rotation.x = -my * 0.22;
    }

    // ── Node instances ─────────────────────────────────────────────────────────
    const inst = nodesRef.current;
    if (inst) {
      const { dir, radii, sizeMul } = nodeData;
      for (let i = 0; i < N; i++) {
        const br = R * radii[i] * (1 + 0.035 * Math.sin(t * 0.55 + i * 0.28));
        const x = dir[i * 3] * br;
        const y = dir[i * 3 + 1] * br;
        const z = dir[i * 3 + 2] * br;
        nodePos[i * 3] = x;
        nodePos[i * 3 + 1] = y;
        nodePos[i * 3 + 2] = z;
        dummy.position.set(x, y, z);
        dummy.scale.setScalar(NODE_SIZE * sizeMul[i]);
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);
      }
      inst.instanceMatrix.needsUpdate = true;
    }

    // ── Node material fade ─────────────────────────────────────────────────────
    const nodeMat = nodeMatRef.current;
    if (nodeMat) {
      // Full presence at fadeOut=0; essentially gone (0.05) at fadeOut=1.
      const presence = lerp(1.0, 0.05, fadeOut);
      nodeMat.emissiveIntensity = 1.8 * presence;
      nodeMat.opacity = presence;
    }

    // ── Line segments ──────────────────────────────────────────────────────────
    const la = lineAttrRef.current;
    if (la) {
      const pairs = nodeData.pairs;
      for (let k = 0; k < pairs.length; k++) {
        const ni = pairs[k];
        linePositions[k * 3] = nodePos[ni * 3];
        linePositions[k * 3 + 1] = nodePos[ni * 3 + 1];
        linePositions[k * 3 + 2] = nodePos[ni * 3 + 2];
      }
      la.needsUpdate = true;
    }

    const lineMat = lineMatRef.current;
    if (lineMat) {
      lineMat.opacity = lerp(0.15, 0.0, fadeOut);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Constellation nodes */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, N]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          ref={nodeMatRef}
          color="#0b2c33"
          emissive="#22d3ee"
          emissiveIntensity={1.8}
          metalness={0.4}
          roughness={0.35}
          transparent
          opacity={1}
          depthWrite={false}
        />
      </instancedMesh>

      {/* Connection hairlines */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            ref={lineAttrRef}
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMatRef}
          color="#22d3ee"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Subtle accent point light near top-left for node relief */}
      <pointLight position={[-3, 2.5, 3]} color="#22d3ee" intensity={4} distance={10} decay={2} />
    </group>
  );
}
