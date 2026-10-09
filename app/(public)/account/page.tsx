export const instant = false;

import { redirect } from "next/navigation";
import Link from "next/link";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import { CalendarCheck, Settings, ArrowRight } from "lucide-react";

export default async function AccountPage() {
  await connection();

  const session = await getSession();

  if (!session) redirect("/login?next=/account");
  if (session.type === "admin") redirect("/admin");

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20 md:pt-36">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <div className="mb-10">
          <div className="eyebrow">Your Account</div>
          <h1 className="mt-6 font-display text-4xl text-ink md:text-5xl">
            Welcome back, {session.full_name || session.username}.
          </h1>
          <p className="lead mt-4">{session.email}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/account/bookings"
            className="glass group rounded-3xl p-8 transition hover:-translate-y-1"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-gold">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl text-ink">My Bookings</h2>
            <p className="mt-2 text-sm text-muted">
              View, reschedule, or download receipts for your reservations.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold">
              View bookings
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/account/settings"
            className="glass group rounded-3xl p-8 transition hover:-translate-y-1"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-gold">
              <Settings className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl text-ink">Settings</h2>
            <p className="mt-2 text-sm text-muted">
              Update your profile, change password, manage notifications.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold">
              Open settings
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
