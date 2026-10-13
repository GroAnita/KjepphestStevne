type IconProps = { className?: string };

export function Heart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.6 4.5c2.2 0 3.6 1.2 5.4 3.2 1.8-2 3.2-3.2 5.4-3.2 3.6 0 5.7 3.8 4.2 7.2C19.5 16.4 12 21 12 21z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Star({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5-4.9-4.5 6.6-.8z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Horseshoe({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M5.5 3.5v8a6.5 6.5 0 0 0 13 0v-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <g fill="white">
        <circle cx="5.5" cy="7" r="0.9" />
        <circle cx="18.5" cy="7" r="0.9" />
        <circle cx="6.6" cy="12.5" r="0.9" />
        <circle cx="17.4" cy="12.5" r="0.9" />
      </g>
    </svg>
  );
}

// Floating hearts, stars and horseshoes scattered behind the page content.
export function FloatingDoodles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <Heart className="absolute left-[6%] top-[8%] size-8 text-bubblegum motion-safe:animate-bob" />
      <Star className="absolute right-[8%] top-[6%] size-9 text-sunny motion-safe:animate-twinkle" />
      <Horseshoe className="absolute left-[10%] top-[46%] hidden size-10 rotate-[-20deg] text-lilac sm:block" />
      <Star className="absolute right-[14%] top-[38%] hidden size-6 text-mint motion-safe:animate-twinkle sm:block" />
      <Heart className="absolute right-[6%] top-[62%] hidden size-7 text-lilac motion-safe:animate-bob sm:block" />
      <Horseshoe className="absolute right-[4%] top-[26%] hidden size-8 rotate-[15deg] text-bubblegum md:block" />
      <Star className="absolute left-[22%] top-[20%] hidden size-5 text-bubblegum motion-safe:animate-twinkle md:block" />
    </div>
  );
}

// Rolling green hills with a little fence along the bottom of the page.
export function Meadow() {
  return (
    <svg
      viewBox="0 0 1200 140"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 w-full sm:h-32"
    >
      <path
        d="M0 70 C 200 20, 380 100, 600 60 C 820 20, 1000 90, 1200 50 V140 H0 Z"
        fill="var(--color-mint-soft)"
      />
      <path
        d="M0 100 C 250 60, 450 130, 700 90 C 900 60, 1050 110, 1200 85 V140 H0 Z"
        fill="var(--color-mint)"
      />
      <g stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.9">
        <path d="M60 112 V78 M140 106 V72 M220 104 V70 M300 108 V74" />
        <path d="M54 86 H306 M54 98 H306" strokeWidth="5" />
      </g>
    </svg>
  );
}
