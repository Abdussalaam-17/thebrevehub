export const instant = false;

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import { createAdminClient } from "@/lib/supabase/admin";
import { UserCog } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";
import { Table, THead, TH, TBody, TR, TD } from "@/components/admin/ui/Table";
import Badge from "@/components/admin/ui/Badge";

export default async function StaffPage() {
  await connection();
  const session = await getSession();
  if (!session || session.type !== "admin") redirect("/login?next=/admin/users");

  const admin = createAdminClient();
  const { data: admins } = await admin
    .from("admin_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Staff" subtitle="Everyone with admin access to this dashboard" />

      {!admins || admins.length === 0 ? (
        <EmptyState icon={UserCog} title="No admins yet" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Username</TH>
              <TH>Role</TH>
              <TH>Joined</TH>
            </TR>
          </THead>
          <TBody>
            {admins.map((a: any) => (
              <TR key={a.id}>
                <TD className="font-medium">{a.username}</TD>
                <TD>
                  <Badge
                    tone={
                      a.role === "owner"
                        ? "gold"
                        : a.role === "manager"
                        ? "blue"
                        : "slate"
                    }
                  >
                    {a.role}
                  </Badge>
                </TD>
                <TD>{new Date(a.created_at).toLocaleDateString()}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
