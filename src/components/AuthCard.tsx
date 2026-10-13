import type { ReactNode } from "react";

// A white card with a "stitched" dashed border, like a horse blanket.
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] bg-white p-2 shadow-[0_12px_40px_-12px_rgba(224,69,127,0.35)]">
      <div className="rounded-[1.6rem] border-2 border-dashed border-blush px-5 py-7 sm:px-8">
        <h1 className="font-display text-3xl font-semibold text-berry sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-plum-soft">{subtitle}</p>
        <div className="mt-6">{children}</div>
        <div className="mt-6 text-center text-plum-soft">{footer}</div>
      </div>
    </section>
  );
}
