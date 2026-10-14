import { HobbyHorse } from "./HobbyHorse";

// Shown while a page waits for the logged-in user.
export function HorseLoader() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-3">
      <HobbyHorse className="w-24 motion-safe:animate-gallop" />
      <p className="font-display text-lg text-plum-soft">Laster …</p>
    </div>
  );
}
