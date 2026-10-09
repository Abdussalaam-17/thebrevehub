export const instant = false;

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import { createAdminClient } from "@/lib/supabase/admin";
import { Inbox } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";
import Badge from "@/components/admin/ui/Badge";

export default async function MessagesPage() {
  await connection();
  const session = await getSession();
  if (!session || session.type !== "admin") redirect("/login?next=/admin/messages");

  const admin = createAdminClient();
  const { data: messages } = await admin
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Messages" subtitle="Contact form submissions from the public site" />

      {!messages || messages.length === 0 ? (
        <EmptyState icon={Inbox} title="No messages yet" />
      ) : (
        <div className="space-y-3">
          {messages.map((m: any) => (
            <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-slate-900">{m.name}</div>
                  <div className="text-xs text-slate-500">{m.email}</div>
                </div>
                <Badge tone={m.read ? "slate" : "amber"}>
                  {m.read ? "Read" : "New"}
                </Badge>
              </div>
              {m.subject && (
                <div className="mt-3 text-sm font-medium text-slate-700">{m.subject}</div>
              )}
              <div className="mt-2 text-sm text-slate-600">{m.body}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
