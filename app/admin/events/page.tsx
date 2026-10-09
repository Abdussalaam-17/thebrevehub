export const instant = false;

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import PageHeader from "@/components/admin/ui/PageHeader";
import EventsManager from "@/components/admin/events/EventsManager";

export default async function EventsPage() {
  await connection();

  const session = await getSession();
  if (!session || session.type !== "admin") redirect("/login?next=/admin/events");

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Create, edit, and publish events for the public site"
      />
      <EventsManager />
    </div>
  );
}
