export const instant = false;

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import { createAdminClient } from "@/lib/supabase/admin";
import PageHeader from "@/components/admin/ui/PageHeader";
import Card from "@/components/admin/ui/Card";

export default async function SettingsPage() {
  await connection();
  const session = await getSession();
  if (!session || session.type !== "admin") redirect("/login?next=/admin/settings");

  const admin = createAdminClient();
  const { data: settings } = await admin.from("settings").select("*");

  return (
    <div>
      <PageHeader title="Settings" subtitle="Venue details and global configuration" />

      <Card>
        <h2 className="text-base font-semibold text-slate-900">Database settings</h2>
        <div className="mt-4 space-y-2 text-sm">
          {settings?.length === 0 ? (
            <p className="text-slate-500">No settings stored yet.</p>
          ) : (
            settings?.map((s: any) => (
              <div
                key={s.key}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2"
              >
                <span className="font-medium text-slate-700">{s.key}</span>
                <span className="text-slate-500">
                  {typeof s.value === "string" ? s.value : JSON.stringify(s.value)}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="text-base font-semibold text-slate-900">Signed in as</h2>
        <div className="mt-3 space-y-1 text-sm text-slate-600">
          <div><strong className="text-slate-900">Username:</strong> {session.username}</div>
          <div><strong className="text-slate-900">Email:</strong> {session.email}</div>
          <div><strong className="text-slate-900">Role:</strong> {session.role}</div>
        </div>
      </Card>
    </div>
  );
}
