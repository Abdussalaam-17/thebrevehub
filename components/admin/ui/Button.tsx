"use client";
import type { ReactNode, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-amber-500 text-slate-900 hover:bg-amber-400 shadow-sm",
  secondary:
    "bg-ink text-cream hover:bg-ink-soft shadow-sm",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 border border-slate-200",
  danger:
    "bg-red-600 text-white hover:bg-red-500 shadow-sm",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
