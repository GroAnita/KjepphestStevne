import type { ReactNode } from "react";
import type { CurrentUser } from "@/lib/auth";
import { FloatingDoodles, Meadow } from "./Doodles";
import { SiteHeader } from "./SiteHeader";

// Page frame for logged-in pages: header with bunting, content, meadow.
export function AppShell({
  user,
  children,
}: {
  user: CurrentUser;
  children: ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-dvh flex-1 flex-col">
      <FloatingDoodles />
      <Meadow />
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-8 sm:px-8 sm:pb-40 sm:pt-12">
        {children}
      </main>
    </div>
  );
}
