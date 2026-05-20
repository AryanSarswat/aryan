interface OrnamentProps {
  size?: number;
  opacity?: number;
}

export default function Ornament({ size = 60, opacity = 0.4 }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 60 60"
      width={size}
      height={size}
      className="spin-slow"
      style={{ opacity, color: "var(--accent)" }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.4">
        <circle cx="30" cy="30" r="28" />
        <circle cx="30" cy="30" r="18" />
        <path d="M30 2 L30 58 M2 30 L58 30 M9 9 L51 51 M51 9 L9 51" />
      </g>
    </svg>
  );
}
