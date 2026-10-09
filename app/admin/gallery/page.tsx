export const instant = false;

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import { createAdminClient } from "@/lib/supabase/admin";
import { Images } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";

export default async function GalleryPage() {
  await connection();
  const session = await getSession();
  if (!session || session.type !== "admin") redirect("/login?next=/admin/gallery");

  const admin = createAdminClient();
  const { data: photos } = await admin
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader title="Gallery" subtitle={`${photos?.length ?? 0} photo${photos?.length === 1 ? "" : "s"}`} />

      {!photos || photos.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No photos yet"
          description="Upload photos of the hall to display on the public site."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {photos.map((p: any) => (
            <div key={p.id} className="group relative overflow-hidden rounded-2xl border border-slate-200">
              <img src={p.url} alt={p.caption || ""} className="aspect-square w-full object-cover" />
              {p.caption && (
                <div className="bg-white p-3 text-xs text-slate-700">{p.caption}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
