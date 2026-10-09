export const instant = false;

import { redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { getSession } from "@/lib/auth/current";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  CalendarCheck,
  PartyPopper,
  Inbox,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import StatCard from "@/components/admin/ui/StatCard";

export default async function AdminOverview() {
  await connection();

  const session = await getSession();
  if (!session || session.type !== "admin") redirect("/login?next=/admin");

  const admin = createAdminClient();

  // Fetch real stats in parallel
  const [
    { count: bookingsCount },
    { count: eventsCount },
    { count: messagesCount },
    { data: bookings },
  ] = await Promise.all([
    admin.from("bookings").select("*", { count: "exact", head: true }),
    admin.from("events").select("*", { count: "exact", head: true }),
    admin.from("messages").select("*", { count: "exact", head: true }).eq("read", false),
    admin.from("bookings").select("total, deposit").eq("status", "paid"),
  ]);

  const revenue = (bookings || []).reduce(
    (sum, b: any) => sum + Number(b.deposit || 0),
    0
  );

  // Recent bookings
  const { data: recent } = await admin
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Signed in as ${session.username} (${session.role})`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total bookings"
          value={bookingsCount ?? 0}
          icon={CalendarCheck}
          tint="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Events"
          value={eventsCount ?? 0}
          icon={PartyPopper}
          tint="bg-purple-100 text-purple-600"
        />
        <StatCard
          label="Unread messages"
          value={messagesCount ?? 0}
          icon={Inbox}
          tint="bg-amber-100 text-amber-600"
        />
        <StatCard
          label="Deposits collected (₦)"
          value={revenue.toLocaleString()}
          icon={DollarSign}
          tint="bg-emerald-100 text-emerald-600"
        />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {!recent || recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No bookings yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Hours</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{b.client_name}</div>
                      <div className="text-xs text-slate-500">{b.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{b.date}</td>
                    <td className="px-4 py-3 text-slate-700">{b.hours}h</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      ₦{Number(b.total).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          b.status === "paid" || b.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-700"
                            : b.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
