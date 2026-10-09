"use client";
import Link from "next/link";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/providers/AuthProvider";

export default function AuthButtons({ solid }: { solid: boolean }) {
  const { user, profile, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="hidden items-center gap-2 lg:flex">
        <div className="h-8 w-16 animate-pulse rounded-full bg-current/10" />
        <div className="h-8 w-16 animate-pulse rounded-full bg-current/10" />
      </div>
    );
  }

  // Logged out
  if (!user) {
    return (
      <div className="hidden items-center gap-2 lg:flex">
        <Link
          href="/login"
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            solid ? "text-ink hover:bg-ink/5" : "text-cream hover:bg-cream/10"
          }`}
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            solid
              ? "border-ink text-ink hover:bg-ink hover:text-cream"
              : "border-cream/40 text-cream hover:border-gold hover:text-gold"
          }`}
        >
          Sign Up
        </Link>
      </div>
    );
  }

  const isAdmin = profile?.type === "admin";

  // Logged in
  return (
    <div className="hidden items-center gap-2 lg:flex">
      {isAdmin && (
        <Link
          href="/admin"
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
            solid
              ? "bg-ink text-cream hover:bg-ink-soft"
              : "bg-gold text-ink hover:bg-gold-soft"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      )}
      {!isAdmin && profile?.type === "client" && (
        <Link
          href="/account"
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
            solid ? "text-ink hover:bg-ink/5" : "text-cream hover:bg-cream/10"
          }`}
        >
          <User className="h-4 w-4" />
          {profile.full_name || profile.username || "Account"}
        </Link>
      )}
      <button
        onClick={logout}
        className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
          solid
            ? "text-muted hover:bg-ink/5 hover:text-ink"
            : "text-cream/70 hover:bg-cream/10 hover:text-cream"
        }`}
        aria-label="Log out"
        title="Log out"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
