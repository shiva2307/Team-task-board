import type { ReactNode } from "react";

export default function AuthLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_60%)]" />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
