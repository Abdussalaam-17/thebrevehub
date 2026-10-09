export const instant = false;

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import PageHeader from "@/components/admin/ui/PageHeader";
import Card from "@/components/admin/ui/Card";
import { BarChart3 } from "lucide-react";

export default async function AnalyticsPage() {
  await connection();
  const session = await getSession();
  if (!session || session.type !== "admin") redirect("/login?next=/admin/analytics");

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Traffic, bookings, and conversions" />

      <Card>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <BarChart3 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            Analytics coming soon
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Page views, conversion funnel, and revenue charts will appear here
            once we wire up tracking.
          </p>
        </div>
      </Card>
    </div>
  );
}
