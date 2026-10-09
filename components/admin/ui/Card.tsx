import type { ReactNode } from "react";

export default function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${
        padded ? "p-6" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
