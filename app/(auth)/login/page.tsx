"use client";

import { Suspense, useState } from "react";
import { useAuth } from "@/lib/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";

// =============================================================
// Inner form — reads searchParams (must be inside <Suspense>)
// =============================================================
function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const next = params.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    await refresh();
    router.push(next || data.redirect || "/");
    router.refresh();
  };

  return (
    <div className="glass-dark rounded-3xl p-7 md:p-8">
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="label label-light">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            className="input input-dark"
            required
          />
        </div>

        <div>
          <label className="label label-light">Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="input input-dark pr-11"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 transition hover:text-cream"
              aria-label="Toggle password"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-gold w-full disabled:opacity-50"
        >
          {loading ? "Please wait…" : "Sign In"}
        </button>

        <p className="text-center text-sm text-cream/60">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-gold hover:underline">
            Sign up
          </Link>
        </p>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.22em] text-cream/30">
        <ShieldCheck className="h-3.5 w-3.5" />
        Secured by Supabase
      </div>
    </div>
  );
}

// =============================================================
// Fallback shown while the form streams in
// =============================================================
function LoginSkeleton() {
  return (
    <div className="glass-dark rounded-3xl p-7 md:p-8">
      <div className="space-y-5">
        <div className="h-16 animate-pulse rounded-xl bg-cream/5" />
        <div className="h-16 animate-pulse rounded-xl bg-cream/5" />
        <div className="h-12 animate-pulse rounded-full bg-cream/5" />
      </div>
    </div>
  );
}

// =============================================================
// Page shell (no useSearchParams here)
// =============================================================
export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gold/15 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[120px]" />
      </div>

      <Link
        href="/"
        className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2 text-xs font-medium text-cream/70 backdrop-blur transition hover:border-gold hover:text-gold md:left-8 md:top-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to site
      </Link>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold font-display text-3xl text-ink shadow-[0_10px_40px_-10px_rgba(201,161,74,0.6)]">
            B
          </span>
          <h1 className="mt-6 font-display text-3xl text-cream md:text-4xl">
            The <span className="italic text-gold">Breve</span> Hub
          </h1>
          <p className="mt-3 text-sm text-cream/50">Sign in to your account.</p>
        </div>

        <Suspense fallback={<LoginSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
