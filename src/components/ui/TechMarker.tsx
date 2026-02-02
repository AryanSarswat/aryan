import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import type { TechItem } from '../../data/techStack';

interface TechMarkerProps {
  tech: TechItem;
  position: [number, number, number];
}

export default function TechMarker({ tech, position }: TechMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    setClicked(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setClicked(false);
    }, 1000);
  };

  return (
    <group position={position}>
      <Html
        center
        style={{
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
      >
        <div
          className="group relative flex cursor-pointer flex-col items-center gap-2"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleClick}
        >
          {/* Glow background */}
          <div
            className="absolute inset-0 rounded-full transition-all duration-500"
            style={{
              backgroundColor: tech.color,
              opacity: hovered ? 0.3 : 0,
              filter: 'blur(20px)',
              transform: 'scale(1.5)',
            }}
          />

          {/* Icon */}
          <div
            className="relative z-10 transition-all duration-500"
            style={{
              transform: hovered || clicked ? 'scale(1.3)' : 'scale(1)',
            }}
          >
            <i
              className={`${tech.icon} text-4xl`}
              style={{
                color: hovered ? tech.color : 'rgba(255, 255, 255, 0.7)',
                filter: hovered ? `drop-shadow(0 0 15px ${tech.color})` : 'none',
                transition: 'all 0.5s ease',
              }}
            />
          </div>

          {/* Label */}
          <div
            className="absolute -bottom-8 whitespace-nowrap text-sm font-medium transition-all duration-500"
            style={{
              color: tech.color,
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(-10px)',
              textShadow: `0 0 10px ${tech.color}`,
            }}
          >
            {tech.name}
          </div>

          {/* Click pulse effect */}
          {clicked && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid ${tech.color}`,
                animation: 'pulse 1s ease-out',
              }}
            />
          )}
        </div>

        <style>{`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}</style>
      </Html>
    </group>
  );
}
