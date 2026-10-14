type ArtProps = { className?: string };

const outline = "var(--color-plum)";

// A show jump: two wing stands with striped poles and flower boxes.
export function JumpArt({ className }: ArtProps) {
  const stripes = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 160 110" className={className} aria-hidden="true">
      <path d="M8 100 H152" stroke="var(--color-mint)" strokeWidth="8" strokeLinecap="round" />
      {[30, 56].map((y) => (
        <g key={y}>
          {stripes.map((i) => (
            <rect
              key={i}
              x={26 + i * 18}
              y={y}
              width="18"
              height="10"
              fill={i % 2 ? "white" : "var(--color-bubblegum)"}
            />
          ))}
          <rect x="26" y={y} width="108" height="10" rx="3" fill="none" stroke={outline} strokeWidth="3.5" />
        </g>
      ))}
      {[14, 134].map((x) => (
        <g key={x}>
          <rect x={x} y="14" width="12" height="84" rx="4" fill="white" stroke={outline} strokeWidth="3.5" />
          <circle cx={x + 6} cy="12" r="6" fill="var(--color-sunny)" stroke={outline} strokeWidth="3.5" />
        </g>
      ))}
      {/* Flower boxes */}
      {[46, 92].map((x) => (
        <g key={x}>
          <rect x={x} y="84" width="22" height="12" rx="3" fill="var(--color-hay)" stroke={outline} strokeWidth="3" />
          <circle cx={x + 5} cy="80" r="4" fill="var(--color-bubblegum)" />
          <circle cx={x + 11} cy="77" r="4" fill="var(--color-lilac)" />
          <circle cx={x + 17} cy="80" r="4" fill="var(--color-sunny)" />
        </g>
      ))}
    </svg>
  );
}

// A prize rosette, the classic dressage reward.
export function RosetteArt({ className }: ArtProps) {
  const petals = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);
  return (
    <svg viewBox="0 0 160 110" className={className} aria-hidden="true">
      {/* Ribbon tails */}
      <path d="M68 58 L54 104 L66 98 L74 108 L84 62 Z" fill="var(--color-lilac)" stroke={outline} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M92 58 L106 104 L94 98 L86 108 L76 62 Z" fill="var(--color-bubblegum)" stroke={outline} strokeWidth="3.5" strokeLinejoin="round" />
      {/* Frilly ring */}
      <g transform="translate(80 46)">
        {petals.map((deg) => (
          <circle
            key={deg}
            cx="0"
            cy="-32"
            r="11"
            transform={`rotate(${deg})`}
            fill="var(--color-lilac)"
            stroke={outline}
            strokeWidth="3.5"
          />
        ))}
        <circle r="32" fill="var(--color-lilac)" />
        <circle r="24" fill="white" stroke={outline} strokeWidth="3.5" />
        <circle r="15" fill="var(--color-sunny)" stroke={outline} strokeWidth="3.5" />
        <path
          d="M0 -8 l2.4 4.9 5.4.8-3.9 3.8.9 5.4L0 4.4l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z"
          fill="white"
          stroke={outline}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
