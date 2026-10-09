import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/current";
import Shell from "@/components/admin/Shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Not an admin → redirect to login
  if (!session || session.type !== "admin") {
    redirect("/login?next=/admin");
  }

  return <Shell username={session.username}>{children}</Shell>;
}
