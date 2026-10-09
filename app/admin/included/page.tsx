export const instant = false;

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import { createAdminClient } from "@/lib/supabase/admin";
import { ListChecks } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";
import { Table, THead, TH, TBody, TR, TD } from "@/components/admin/ui/Table";

export default async function IncludedPage() {
  await connection();
  const session = await getSession();
  if (!session || session.type !== "admin") redirect("/login?next=/admin/included");

  const admin = createAdminClient();
  const { data: items } = await admin
    .from("inclusions")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader title="What's Included" subtitle="Amenities bundled with the hourly rate" />

      {!items || items.length === 0 ? (
        <EmptyState icon={ListChecks} title="No inclusions yet" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Title</TH>
              <TH>Icon</TH>
              <TH>Description</TH>
              <TH>Order</TH>
            </TR>
          </THead>
          <TBody>
            {items.map((i: any) => (
              <TR key={i.id}>
                <TD className="font-medium">{i.title}</TD>
                <TD>{i.icon}</TD>
                <TD>{i.description}</TD>
                <TD>{i.sort_order}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
