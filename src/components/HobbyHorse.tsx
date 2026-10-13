type HobbyHorseProps = {
  className?: string;
};

// A cute hobby horse (kjepphest): a horse head on a stick.
export function HobbyHorse({ className }: HobbyHorseProps) {
  const outline = "var(--color-plum)";
  const mane = [
    [82, 36, "var(--color-bubblegum)"],
    [68, 47, "var(--color-lilac)"],
    [58, 63, "var(--color-bubblegum)"],
    [52, 81, "var(--color-lilac)"],
    [50, 99, "var(--color-bubblegum)"],
    [51, 117, "var(--color-lilac)"],
    [56, 134, "var(--color-bubblegum)"],
  ] as const;

  return (
    <svg
      viewBox="0 0 200 250"
      className={className}
      role="img"
      aria-label="Kjepphest"
    >
      {/* Stick */}
      <path
        d="M74 140 L46 240"
        stroke={outline}
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M74 140 L46 240"
        stroke="var(--color-hay)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* Mane, tucked behind the head */}
      {mane.map(([cx, cy, fill]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="13"
          fill={fill}
          stroke={outline}
          strokeWidth="4"
        />
      ))}

      {/* Ear */}
      <path
        d="M88 46 L96 14 L112 40 Z"
        fill="white"
        stroke={outline}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M95 38 L98 24 L105 37 Z" fill="var(--color-blush)" />

      {/* Head and neck */}
      <path
        d="M60 144 C 52 112, 54 76, 74 52 C 90 34, 114 32, 132 46 C 150 60, 164 78, 172 96 C 178 112, 171 127, 156 128 C 142 129, 128 122, 117 120 C 110 133, 105 141, 99 149 C 86 157, 68 156, 60 144 Z"
        fill="white"
        stroke={outline}
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Forelock */}
      <circle
        cx="104"
        cy="45"
        r="10"
        fill="var(--color-bubblegum)"
        stroke={outline}
        strokeWidth="4"
      />

      {/* Eye with lashes */}
      <circle cx="124" cy="72" r="7.5" fill={outline} />
      <circle cx="126.5" cy="69" r="2.6" fill="white" />
      <path
        d="M118 64 L114 59 M124 62 L123 56 M130 64 L133 59"
        stroke={outline}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Blush, nostril and smile */}
      <ellipse cx="134" cy="88" rx="9" ry="5.5" fill="var(--color-bubblegum)" opacity="0.45" />
      <ellipse cx="162" cy="104" rx="3" ry="4" fill={outline} />
      <path
        d="M146 117 Q 155 122 162 116"
        stroke={outline}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Bow where the neck meets the stick */}
      <path
        d="M76 150 L58 140 L60 162 Z M76 150 L94 140 L92 162 Z"
        fill="var(--color-berry)"
        stroke={outline}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <circle cx="76" cy="151" r="5" fill="var(--color-berry)" stroke={outline} strokeWidth="3.5" />
    </svg>
  );
}
