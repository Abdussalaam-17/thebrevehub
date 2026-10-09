export const instant = false;

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import { createAdminClient } from "@/lib/supabase/admin";
import { CalendarDays } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import Card from "@/components/admin/ui/Card";

export default async function CalendarPage() {
  await connection();
  const session = await getSession();
  if (!session || session.type !== "admin") redirect("/login?next=/admin/calendar");

  const admin = createAdminClient();
  const { data: bookings } = await admin
    .from("bookings")
    .select("date, hours, client_name, status")
    .in("status", ["paid", "confirmed"])
    .order("date");

  return (
    <div>
      <PageHeader title="Calendar" subtitle="Blocked dates and confirmed bookings" />

      <Card>
        <div className="text-sm text-slate-600">
          <strong>{bookings?.length ?? 0}</strong> confirmed date
          {bookings?.length === 1 ? "" : "s"} blocked
        </div>

        {bookings && bookings.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {bookings.map((b: any, i: number) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm"
              >
                <span className="font-medium text-slate-900">{b.date}</span>
                <span className="text-slate-500">
                  {b.hours}h · {b.client_name}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 flex flex-col items-center py-12 text-center">
            <CalendarDays className="h-10 w-10 text-slate-300" />
            <p className="mt-4 text-sm text-slate-500">
              No confirmed bookings yet.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
