"use client";
import { useState } from "react";
import { useAuth } from "@/lib/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username, phone }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    // Server decides: /admin for admins, /account for clients
    await refresh();
    router.push(data.redirect || "/");
    router.refresh();
  };

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
            Create your account
          </h1>
          <p className="mt-3 text-sm text-cream/50">
            Book the hall, manage your events, and get updates.
          </p>
        </div>

        <div className="glass-dark rounded-3xl p-7 md:p-8">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="label label-light">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="e.g. rasheed"
                className="input input-dark"
                required
              />
            </div>

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
              <label className="label label-light">
                Phone <span className="normal-case tracking-normal text-cream/30">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                placeholder="+234..."
                className="input input-dark"
              />
            </div>

            <div>
              <label className="label label-light">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className="input input-dark pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 transition hover:text-cream"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label label-light">Confirm Password</label>
              <input
                type={showPw ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                className="input input-dark"
                required
              />
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
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <p className="text-center text-sm text-cream/60">
              Already have an account?{" "}
              <Link href="/login" className="text-gold hover:underline">
                Sign in
              </Link>
            </p>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.22em] text-cream/30">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secured by Supabase
          </div>
        </div>
      </div>
    </div>
  );
}
