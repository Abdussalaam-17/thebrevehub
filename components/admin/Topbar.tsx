"use client";
import Link from "next/link";
import { Menu, Bell, ExternalLink } from "lucide-react";

export default function Topbar({
  onMenuClick,
  username,
}: {
  onMenuClick: () => void;
  username: string;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-5 backdrop-blur-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="hidden text-sm text-slate-500 lg:block">
          Welcome back,{" "}
          <span className="font-semibold text-slate-900">{username}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Back to site */}
        <Link
          href="/"
          className="hidden items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white sm:inline-flex"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Back to site
        </Link>

        {/* Notifications */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100">
          <Bell className="h-5 w-5" />
        </button>

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-slate-900">
          {username.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
