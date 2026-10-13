import { FloatingDoodles, Meadow } from "@/components/Doodles";
import { HobbyHorse } from "@/components/HobbyHorse";
import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative isolate flex min-h-dvh flex-1 flex-col">
      <FloatingDoodles />
      <Meadow />

      <header className="px-4 pt-5 sm:px-8">
        <Logo />
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-2 px-4 pb-28 pt-4 sm:pb-40 md:flex-row md:items-center md:justify-center md:gap-12">
        <HobbyHorse className="w-28 shrink-0 motion-safe:animate-gallop sm:w-36 md:w-64" />
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
