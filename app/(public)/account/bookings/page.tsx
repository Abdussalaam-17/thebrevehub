export const instant = false;

import { redirect } from "next/navigation";
import Link from "next/link";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Calendar } from "lucide-react";

export default async function MyBookingsPage() {
  await connection();

  const session = await getSession();
  if (!session) redirect("/login?next=/account/bookings");
  if (session.type === "admin") redirect("/admin");

  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .or(`user_id.eq.${session.id},email.ilike.${session.email}`)
    .order("date", { ascending: false });

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20 md:pt-36">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Back to account
        </Link>

        <div className="mb-10">
          <h1 className="font-display text-4xl text-ink md:text-5xl">My Bookings</h1>
          <p className="lead mt-3">All your reservations in one place.</p>
        </div>

        {!bookings || bookings.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <Calendar className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 text-muted">You haven&apos;t booked the hall yet.</p>
            <Link href="/book" className="btn btn-gold mt-6">
              Book the hall
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b: any) => (
              <div key={b.id} className="glass rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-display text-xl text-ink">
                      {b.event_type || "Event"}
                    </div>
                    <div className="mt-1 text-sm text-muted">
                      {b.date} · {b.hours} hour{b.hours > 1 ? "s" : ""}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      b.status === "paid" || b.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : b.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted">Total</div>
                    <div className="mt-1 font-display text-lg text-ink">
                      ₦{Number(b.total).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted">Balance</div>
                    <div className="mt-1 font-display text-lg text-ink">
                      ₦{Number(b.balance).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
