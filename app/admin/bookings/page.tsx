export const instant = false;

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import PageHeader from "@/components/admin/ui/PageHeader";
import BookingsManager from "@/components/admin/bookings/BookingsManager";

export default async function BookingsPage() {
  await connection();

  const session = await getSession();
  if (!session || session.type !== "admin") {
    redirect("/login?next=/admin/bookings");
  }

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Manage client bookings — approve, mark paid, cancel, edit"
      />
      <BookingsManager />
    </div>
  );
}
