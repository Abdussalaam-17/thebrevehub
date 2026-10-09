"use client";
import Link from "next/link";
import { LogOut, User, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/providers/AuthProvider";

export default function MobileAuthBlock({ onClose }: { onClose: () => void }) {
  const { user, profile, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="mt-8 rounded-2xl border border-line bg-cream-deep p-5">
        <div className="h-4 w-24 animate-pulse rounded bg-line" />
        <div className="mt-4 h-10 animate-pulse rounded-full bg-line" />
      </div>
    );
  }

  // Logged out
  if (!user) {
    return (
      <div className="mt-8 rounded-2xl border border-line bg-cream-deep p-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
          Your Account
        </div>
        <div className="mt-4 space-y-2">
          <Link
            href="/login"
            onClick={onClose}
            className="btn btn-outline w-full"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            onClick={onClose}
            className="btn btn-gold w-full"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const isAdmin = profile?.type === "admin";
  const label = isAdmin
    ? profile.username || "Admin"
    : profile?.type === "client"
    ? profile.full_name || profile.username || "Account"
    : "Account";

  return (
    <div className="mt-8 rounded-2xl border border-line bg-cream-deep p-5">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
            isAdmin ? "bg-gold text-ink" : "bg-ink text-cream"
          }`}
        >
          {isAdmin ? "A" : (label.charAt(0) || "U").toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-ink">{label}</div>
          <div className="truncate text-[11px] text-muted">{user.email}</div>
        </div>
        {isAdmin && (
          <span className="flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
            <ShieldCheck className="h-3 w-3" />
            Admin
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {isAdmin ? (
          <Link
            href="/admin"
            onClick={onClose}
            className="btn btn-ink w-full"
          >
            <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
          </Link>
        ) : (
          <Link
            href="/account"
            onClick={onClose}
            className="btn btn-ink w-full"
          >
            <User className="h-4 w-4" /> My Account
          </Link>
        )}
        <button
          onClick={() => {
            onClose();
            logout();
          }}
          className="btn btn-outline w-full text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" /> Log Out
        </button>
      </div>
    </div>
  );
}
