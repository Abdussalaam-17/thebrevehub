export const instant = false;

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import { createAdminClient } from "@/lib/supabase/admin";
import { HelpCircle } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";

export default async function FAQsPage() {
  await connection();
  const session = await getSession();
  if (!session || session.type !== "admin") redirect("/login?next=/admin/faqs");

  const admin = createAdminClient();
  const { data: faqs } = await admin
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader title="FAQs" subtitle="Frequently asked questions shown on the public site" />

      {!faqs || faqs.length === 0 ? (
        <EmptyState icon={HelpCircle} title="No FAQs yet" />
      ) : (
        <div className="space-y-3">
          {faqs.map((f: any) => (
            <div key={f.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="font-semibold text-slate-900">{f.question}</div>
              <div className="mt-2 text-sm text-slate-600">{f.answer}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
