import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { techStack, type TechItem } from '../../data/techStack';

interface TechMarkerProps {
  tech: TechItem;
  position: [number, number, number];
}

function TechMarker({ tech, position }: TechMarkerProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Html
        center
        style={{
          pointerEvents: 'auto',
          userSelect: 'none',
          cursor: 'pointer',
        }}
      >
        <div
          className="relative flex flex-col items-center"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Glow background */}
          <div
            className="absolute inset-0 rounded-full transition-all duration-300"
            style={{
              backgroundColor: tech.color,
              opacity: hovered ? 0.4 : 0,
              filter: 'blur(15px)',
              transform: hovered ? 'scale(2)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
          />

          {/* Icon */}
          <div
            className="relative z-10 transition-all duration-300"
            style={{
              transform: hovered ? 'scale(1.4)' : 'scale(1)',
            }}
          >
            <tech.icon
              size={32}
              style={{
                color: hovered ? tech.color : 'rgba(255, 255, 255, 0.8)',
                filter: hovered ? `drop-shadow(0 0 10px ${tech.color})` : 'none',
                transition: 'all 0.3s ease',
              }}
            />
          </div>

          {/* Label */}
          <div
            className="absolute -bottom-10 left-1/2 whitespace-nowrap text-sm font-bold"
            style={{
              color: tech.color,
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-8px)',
              textShadow: `0 0 10px ${tech.color}`,
              transition: 'all 0.3s ease',
            }}
          >
            {tech.name}
          </div>
        </div>
      </Html>
    </mesh>
  );
}

interface TechGlobeSceneProps {
  techs: TechItem[];
  radius?: number;
}

// Define sections for each category on the globe
const categorySections: Record<TechItem['category'], { thetaMin: number; thetaMax: number; phiMin: number; phiMax: number }> = {
  language: { thetaMin: 0, thetaMax: Math.PI / 2, phiMin: 0.3, phiMax: Math.PI - 0.3 }, // Front-right quadrant
  ml: { thetaMin: Math.PI / 2, thetaMax: Math.PI, phiMin: 0.3, phiMax: Math.PI - 0.3 }, // Front-left quadrant
  web: { thetaMin: Math.PI, thetaMax: 3 * Math.PI / 2, phiMin: 0.3, phiMax: Math.PI - 0.3 }, // Back-left quadrant
  tools: { thetaMin: 3 * Math.PI / 2, thetaMax: 2 * Math.PI, phiMin: 0.3, phiMax: Math.PI - 0.3 }, // Back-right quadrant
};

function TechGlobeScene({ techs, radius = 12 }: TechGlobeSceneProps) {
  // Group techs by category and generate positions within their section
  const groupedTechs = useMemo(() => {
    const grouped: Record<TechItem['category'], TechItem[]> = {
      language: [],
      ml: [],
      web: [],
      tools: [],
    };
    techs.forEach(tech => {
      grouped[tech.category].push(tech);
    });
    return grouped;
  }, [techs]);

  // Generate positions for each tech within its category section with minimum spacing
  const markerPositions = useMemo(() => {
    const positions: Record<string, [number, number, number]> = {};
    const minDistance = 2.5; // Minimum distance between icons on the sphere surface
    const maxAttempts = 100; // Maximum attempts to find a non-overlapping position

    (Object.keys(groupedTechs) as TechItem['category'][]).forEach(category => {
      const section = categorySections[category];
      const categoryTechs = groupedTechs[category];
      const categoryPositions: [number, number, number][] = [];

      categoryTechs.forEach(tech => {
        let attempts = 0;
        let validPosition: [number, number, number] | null = null;

        while (attempts < maxAttempts && !validPosition) {
          // Random position within the category's section
          const theta = section.thetaMin + Math.random() * (section.thetaMax - section.thetaMin);
          const phi = section.phiMin + Math.random() * (section.phiMax - section.phiMin);

          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.sin(phi) * Math.sin(theta);
          const z = radius * Math.cos(phi);

          const newPos: [number, number, number] = [x, y, z];

          // Check distance from all existing positions in this category
          let isValid = true;
          for (const existingPos of categoryPositions) {
            const dx = newPos[0] - existingPos[0];
            const dy = newPos[1] - existingPos[1];
            const dz = newPos[2] - existingPos[2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < minDistance) {
              isValid = false;
              break;
            }
          }

          if (isValid) {
            validPosition = newPos;
          }

          attempts++;
        }

        // If we couldn't find a valid position after max attempts, use the last generated one anyway
        if (!validPosition) {
          const theta = section.thetaMin + Math.random() * (section.thetaMax - section.thetaMin);
          const phi = section.phiMin + Math.random() * (section.phiMax - section.phiMin);
          validPosition = [
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi),
          ];
        }

        categoryPositions.push(validPosition);
        positions[tech.name] = validPosition;
      });
    });

    return positions;
  }, [groupedTechs, radius]);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />

      {/* Wireframe globe */}
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color="#64748b"
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Tech markers with icons */}
      {techs.map((tech) => (
        <TechMarker
          key={tech.name}
          tech={tech}
          position={markerPositions[tech.name]}
        />
      ))}

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enableZoom={false}
        enablePan={false}
      />
    </>
  );
}

export default function TechGlobe() {
  return (
    <div className="relative h-[700px] w-full rounded-2xl bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 35], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <TechGlobeScene techs={techStack} />
      </Canvas>

      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/50">
        Drag to rotate • Hover icons for details
      </div>
    </div>
  );
}
