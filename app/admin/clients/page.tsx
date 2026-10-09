export const instant = false;

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import { createAdminClient } from "@/lib/supabase/admin";
import { Users } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";
import { Table, THead, TH, TBody, TR, TD } from "@/components/admin/ui/Table";

export default async function ClientsPage() {
  await connection();
  const session = await getSession();
  if (!session || session.type !== "admin") redirect("/login?next=/admin/clients");

  const admin = createAdminClient();
  const { data: clients } = await admin
    .from("client_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Clients" subtitle={`${clients?.length ?? 0} registered client${clients?.length === 1 ? "" : "s"}`} />

      {!clients || clients.length === 0 ? (
        <EmptyState icon={Users} title="No clients yet" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Username</TH>
              <TH>Phone</TH>
              <TH>Joined</TH>
            </TR>
          </THead>
          <TBody>
            {clients.map((c: any) => (
              <TR key={c.id}>
                <TD className="font-medium">{c.full_name || "—"}</TD>
                <TD>{c.username || "—"}</TD>
                <TD>{c.phone || "—"}</TD>
                <TD>{new Date(c.created_at).toLocaleDateString()}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
