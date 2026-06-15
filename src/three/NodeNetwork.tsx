import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState, burstQueue } from "./scrollState";
import { clamp, lerp, smoothstep, hash, PHI, TAU } from "./mathUtils";

/**
 * The persistent 3D anchor of the entire portfolio: a network of glowing nodes
 * connected by hairlines. A single continuous `morph` value (0→5, written by the
 * scroll controller) blends the node layout between six forms:
 *
 *   0 Hero      sphere lattice, slow spin, cursor parallax
 *   1 About     same lattice, scaled down + pushed right
 *   2 Writing   flattened into a horizontal wave (ripples on link hover)
 *   3 Work      fractured into parallax depth layers that pan with workPan
 *   4 Career    reformed into a vertical helical track (emits bursts)
 *   5 Contact   imploded into a tight core behind a soft background glow
 */

// Anchor tables, indexed by section 0..5. Adjacent anchors are blended.
const ANCHOR_POS_X = [0, 1.7, 0, 0, 1.35, 0];
const ANCHOR_POS_Y = [0, 0.15, -0.1, 0, 0, 0];
const ANCHOR_POS_Z = [0, 0, 0, -0.6, 0, 0.2];
const ANCHOR_SCALE = [1, 0.62, 1.0, 1.12, 0.92, 0.5];
const ANCHOR_ROT_X = [0, 0, -0.42, 0.06, 0, 0];
// Per-section visual presence: recede behind text-heavy sections
// (About / Writing / Career), stay bold in Hero / Work / Contact.
const ANCHOR_PRESENCE = [1, 0.4, 0.6, 0.85, 0.5, 1];

function radialGlowTexture(): THREE.Texture {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(103, 232, 249, 0.9)");
  g.addColorStop(0.25, "rgba(34, 211, 238, 0.5)");
  g.addColorStop(1, "rgba(34, 211, 238, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

export default function NodeNetwork() {
  const group = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const lineAttr = useRef<THREE.BufferAttribute>(null);
  const burstPosAttr = useRef<THREE.BufferAttribute>(null);
  const burstColAttr = useRef<THREE.BufferAttribute>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);

  const spin = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const glowTex = useMemo(radialGlowTexture, []);
  // Release the GPU texture when the scene unmounts (e.g. breakpoint remount).
  useEffect(() => () => glowTex.dispose(), [glowTex]);
  const burstDir = useMemo(() => new THREE.Vector3(), []);

  const mobile = scrollState.isMobile;
  const N = mobile ? 70 : 140;
  const BURST_MAX = mobile ? 60 : 160;
  const BURST_PER = mobile ? 9 : 20;
  const nodeSize = mobile ? 0.046 : 0.04;
  const R = 2.2;

  // ── Precomputed per-node geometry for every form ──────────────────
  const data = useMemo(() => {
    const heroDir = new Float32Array(N * 3);
    const heroR = new Float32Array(N);
    const sizeMul = new Float32Array(N);
    const gx = new Float32Array(N); // wave grid
    const gz = new Float32Array(N);
    const layer = new Int8Array(N); // work layers
    const wx = new Float32Array(N);
    const wy = new Float32Array(N);
    const LAYERS = 4;

    const cols = Math.ceil(Math.sqrt(N * 2.2));
    for (let i = 0; i < N; i++) {
      // Fibonacci sphere → even shell distribution
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = PHI * i;
      heroDir[i * 3] = Math.cos(theta) * r;
      heroDir[i * 3 + 1] = y;
      heroDir[i * 3 + 2] = Math.sin(theta) * r;
      heroR[i] = 0.9 + hash(i) * 0.22;
      sizeMul[i] = 0.7 + hash(i * 3.3) * 0.8;

      const col = i % cols;
      const row = Math.floor(i / cols);
      const rows = Math.ceil(N / cols);
      gx[i] = (col / (cols - 1) - 0.5) * 2;
      gz[i] = (row / Math.max(1, rows - 1) - 0.5) * 2;

      layer[i] = i % LAYERS;
      wx[i] = hash(i * 1.7) * 2 - 1;
      wy[i] = hash(i * 2.9) * 2 - 1;
    }

    // Connection pairs: each node links to its two nearest neighbours.
    const pairSet = new Set<string>();
    const pairs: number[] = [];
    for (let i = 0; i < N; i++) {
      let n1 = -1;
      let n2 = -1;
      let d1 = Infinity;
      let d2 = Infinity;
      const ix = heroDir[i * 3];
      const iy = heroDir[i * 3 + 1];
      const iz = heroDir[i * 3 + 2];
      for (let j = 0; j < N; j++) {
        if (j === i) continue;
        const dx = ix - heroDir[j * 3];
        const dy = iy - heroDir[j * 3 + 1];
        const dz = iz - heroDir[j * 3 + 2];
        const d = dx * dx + dy * dy + dz * dz;
        if (d < d1) {
          d2 = d1;
          n2 = n1;
          d1 = d;
          n1 = j;
        } else if (d < d2) {
          d2 = d;
          n2 = j;
        }
      }
      for (const nb of [n1, n2]) {
        if (nb < 0) continue;
        const key = i < nb ? `${i}_${nb}` : `${nb}_${i}`;
        if (!pairSet.has(key)) {
          pairSet.add(key);
          pairs.push(i, nb);
        }
      }
    }

    return { heroDir, heroR, sizeMul, gx, gz, layer, wx, wy, LAYERS, pairs };
  }, [N]);

  const linePositions = useMemo(
    () => new Float32Array(data.pairs.length * 3),
    [data.pairs.length]
  );
  const burstPositions = useMemo(() => {
    const a = new Float32Array(BURST_MAX * 3);
    for (let i = 0; i < BURST_MAX; i++) a[i * 3 + 1] = 1e6; // park offscreen
    return a;
  }, [BURST_MAX]);
  const burstColors = useMemo(() => new Float32Array(BURST_MAX * 3), [BURST_MAX]);
  const burstVel = useMemo(() => new Float32Array(BURST_MAX * 3), [BURST_MAX]);
  const burstLife = useMemo(() => new Float32Array(BURST_MAX), [BURST_MAX]);

  // Scratch buffer of current node positions (re-used to rebuild line segments).
  const pos = useMemo(() => new Float32Array(N * 3), [N]);

  // ── Form evaluator: position of node i for a given anchor at time t ──
  const formPos = (
    i: number,
    anchor: number,
    t: number,
    out: THREE.Vector3
  ): THREE.Vector3 => {
    const d = data;
    switch (anchor) {
      case 2: {
        // Writing — horizontal wave
        const waveW = 3.3;
        const waveD = 1.4;
        const x = d.gx[i] * waveW;
        const z = d.gz[i] * waveD;
        let y = 0.45 * Math.sin(x * 1.1 + t * 1.1 + z * 0.6);
        if (scrollState.ripple > 0.001) {
          const dx = (x - scrollState.rippleX * waveW) * 0.9;
          y += scrollState.ripple * 0.9 * Math.exp(-dx * dx);
        }
        return out.set(x, y, z);
      }
      case 3: {
        // Work — fractured parallax layers panning with workPan
        const pan = (scrollState.workPan - 0.5) * 4.2;
        const parallax = 0.45 + d.layer[i] * 0.22;
        const x = d.wx[i] * 2.6 + pan * parallax + 0.05 * Math.sin(t + i);
        const y = d.wy[i] * 1.7;
        const z = (d.layer[i] - (d.LAYERS - 1) / 2) * 0.9;
        return out.set(x, y, z);
      }
      case 4: {
        // Career — vertical helical track
        const p = i / (N - 1);
        const ang = p * TAU * 3 + t * 0.2;
        const rad = 0.55;
        return out.set(Math.cos(ang) * rad, (p - 0.5) * 6.5, Math.sin(ang) * rad);
      }
      case 5: {
        // Contact — implosion into a tight core
        const rad = 0.12 + hash(i) * 0.16;
        const pulse = 1 + 0.3 * Math.sin(t * 2 + i);
        return out.set(
          d.heroDir[i * 3] * rad * pulse,
          d.heroDir[i * 3 + 1] * rad * pulse,
          d.heroDir[i * 3 + 2] * rad * pulse
        );
      }
      default: {
        // Hero / About — breathing sphere shell
        const br = R * d.heroR[i] * (1 + 0.04 * Math.sin(t * 0.6 + i * 0.3));
        return out.set(
          d.heroDir[i * 3] * br,
          d.heroDir[i * 3 + 1] * br,
          d.heroDir[i * 3 + 2] * br
        );
      }
    }
  };

  const vLo = useMemo(() => new THREE.Vector3(), []);
  const vHi = useMemo(() => new THREE.Vector3(), []);
  const accent = useMemo(() => new THREE.Color("#22d3ee"), []);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.elapsedTime;
    const reduced = scrollState.reduced;
    const m = reduced ? 0 : clamp(scrollState.morph, 0, 5);
    const lo = Math.floor(m);
    const hi = Math.min(lo + 1, 5);
    const f = smoothstep(m - lo);
    const presence = lerp(ANCHOR_PRESENCE[lo], ANCHOR_PRESENCE[hi], f);

    // Decay the writing ripple.
    scrollState.ripple *= reduced ? 0 : 0.93;

    // ── Group transform (blend adjacent anchors) ──
    const g = group.current;
    if (g) {
      const offsetScale = mobile ? 0.32 : 1;
      const px = lerp(ANCHOR_POS_X[lo], ANCHOR_POS_X[hi], f) * offsetScale;
      const py = lerp(ANCHOR_POS_Y[lo], ANCHOR_POS_Y[hi], f);
      const pz = lerp(ANCHOR_POS_Z[lo], ANCHOR_POS_Z[hi], f);
      const sc = lerp(ANCHOR_SCALE[lo], ANCHOR_SCALE[hi], f) * (mobile ? 0.82 : 1);
      const rx = lerp(ANCHOR_ROT_X[lo], ANCHOR_ROT_X[hi], f);

      const mx = reduced ? 0 : scrollState.mouseX;
      const my = reduced ? 0 : scrollState.mouseY;
      g.position.set(px + mx * 0.15, py - my * 0.1, pz);
      g.scale.setScalar(sc);

      const spinFactor = reduced ? 0 : clamp(1.2 - m, 0, 1);
      spin.current += dt * 0.16 * spinFactor;
      g.rotation.y = spin.current + mx * 0.4;
      g.rotation.x = rx - my * 0.25;
    }

    // ── Node instances + capture positions for the line mesh ──
    const inst = nodesRef.current;
    if (inst) {
      for (let i = 0; i < N; i++) {
        formPos(i, lo, t, vLo);
        formPos(i, hi, t, vHi);
        const x = lerp(vLo.x, vHi.x, f);
        const y = lerp(vLo.y, vHi.y, f);
        const z = lerp(vLo.z, vHi.z, f);
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
        dummy.position.set(x, y, z);
        const s = nodeSize * data.sizeMul[i];
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);
      }
      inst.instanceMatrix.needsUpdate = true;
      const mat = inst.material as THREE.MeshStandardMaterial;
      const contactW = clamp(m - 4, 0, 1);
      mat.emissiveIntensity = 1.7 * presence + scrollState.ripple * 1.6;
      mat.opacity = presence * (1 - contactW * 0.55);
    }

    // ── Line segments rebuilt from current node positions ──
    if (lineAttr.current) {
      const arr = linePositions;
      const pairs = data.pairs;
      for (let k = 0; k < pairs.length; k++) {
        const node = pairs[k];
        arr[k * 3] = pos[node * 3];
        arr[k * 3 + 1] = pos[node * 3 + 1];
        arr[k * 3 + 2] = pos[node * 3 + 2];
      }
      lineAttr.current.needsUpdate = true;
    }
    if (lineMatRef.current) lineMatRef.current.opacity = 0.16 * presence;

    // ── Background glow (rises during the Contact implosion) ──
    if (glowRef.current) {
      const contactW = smoothstep(clamp(m - 4, 0, 1));
      const base = 0.18 + contactW * 0.9;
      glowRef.current.scale.setScalar(lerp(1.6, 6.5, contactW));
      (glowRef.current.material as THREE.SpriteMaterial).opacity = base;
    }

    // ── Particle bursts (Career milestones) ──
    if (burstPosAttr.current && burstColAttr.current) {
      // Spawn from queued requests.
      while (burstQueue.length) {
        const req = burstQueue.shift()!;
        let spawned = 0;
        for (let i = 0; i < BURST_MAX && spawned < BURST_PER; i++) {
          if (burstLife[i] > 0.01) continue;
          burstLife[i] = 1;
          burstPositions[i * 3] = req.x;
          burstPositions[i * 3 + 1] = req.y;
          burstPositions[i * 3 + 2] = req.z;
          const dir = burstDir
            .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
            .normalize();
          const sp = 0.6 + Math.random() * 1.4;
          burstVel[i * 3] = dir.x * sp;
          burstVel[i * 3 + 1] = dir.y * sp;
          burstVel[i * 3 + 2] = dir.z * sp;
          spawned++;
        }
      }
      // Integrate + fade (additive: brightness doubles as alpha).
      for (let i = 0; i < BURST_MAX; i++) {
        const life = burstLife[i];
        if (life <= 0.01) {
          burstColors[i * 3] = burstColors[i * 3 + 1] = burstColors[i * 3 + 2] = 0;
          continue;
        }
        const nl = Math.max(0, life - dt * 0.85);
        burstLife[i] = nl;
        burstPositions[i * 3] += burstVel[i * 3] * dt;
        burstPositions[i * 3 + 1] += burstVel[i * 3 + 1] * dt;
        burstPositions[i * 3 + 2] += burstVel[i * 3 + 2] * dt;
        burstVel[i * 3] *= 0.95;
        burstVel[i * 3 + 1] *= 0.95;
        burstVel[i * 3 + 2] *= 0.95;
        if (nl <= 0.01) {
          burstPositions[i * 3 + 1] = 1e6;
          burstColors[i * 3] = burstColors[i * 3 + 1] = burstColors[i * 3 + 2] = 0;
        } else {
          burstColors[i * 3] = accent.r * nl;
          burstColors[i * 3 + 1] = accent.g * nl;
          burstColors[i * 3 + 2] = accent.b * nl;
        }
      }
      burstPosAttr.current.needsUpdate = true;
      burstColAttr.current.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, N]}
        frustumCulled={false}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#0b2c33"
          emissive="#22d3ee"
          emissiveIntensity={1.8}
          metalness={0.4}
          roughness={0.35}
          transparent
        />
      </instancedMesh>

      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            ref={lineAttr}
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMatRef}
          color="#22d3ee"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            ref={burstPosAttr}
            attach="attributes-position"
            args={[burstPositions, 3]}
          />
          <bufferAttribute
            ref={burstColAttr}
            attach="attributes-color"
            args={[burstColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={mobile ? 0.09 : 0.07}
          sizeAttenuation
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <sprite ref={glowRef} scale={1.6}>
        <spriteMaterial
          map={glowTex}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}
