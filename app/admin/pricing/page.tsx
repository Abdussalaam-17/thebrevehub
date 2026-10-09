export const instant = false;

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import { createAdminClient } from "@/lib/supabase/admin";
import { DollarSign } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import Card from "@/components/admin/ui/Card";
import { Table, THead, TH, TBody, TR, TD } from "@/components/admin/ui/Table";

export default async function PricingPage() {
  await connection();
  const session = await getSession();
  if (!session || session.type !== "admin") redirect("/login?next=/admin/pricing");

  const admin = createAdminClient();
  const { data: extras } = await admin
    .from("extras")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: settings } = await admin
    .from("settings")
    .select("*")
    .in("key", ["hourly_rate", "deposit_percent"]);

  const get = (key: string) =>
    settings?.find((s: any) => s.key === key)?.value ?? "—";

  return (
    <div>
      <PageHeader title="Pricing" subtitle="Hourly rate, deposit %, and add-on services" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="text-xs uppercase tracking-wider text-slate-500">Hourly rate</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">
            ₦{Number(get("hourly_rate")).toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-slate-500">Deposit</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">
            {get("deposit_percent")}%
          </div>
        </Card>
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold text-slate-900">Add-on services</h2>

      {!extras || extras.length === 0 ? (
        <Card>
          <div className="text-sm text-slate-500">No extras configured.</div>
        </Card>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Service</TH>
              <TH>Description</TH>
              <TH>Price</TH>
              <TH>Active</TH>
            </TR>
          </THead>
          <TBody>
            {extras.map((x: any) => (
              <TR key={x.id}>
                <TD className="font-medium">{x.name}</TD>
                <TD>{x.description || "—"}</TD>
                <TD>₦{Number(x.price).toLocaleString()}</TD>
                <TD>{x.active ? "✅" : "❌"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
