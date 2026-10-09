import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  return profile ? { id: user.id } : null;
}

// PATCH — update event
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const caller = await requireAdmin();
  if (!caller) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("events")
    .update({
      title: body.title,
      description: body.description || null,
      host: body.host || null,
      date: body.date,
      start_time: body.start_time || null,
      end_time: body.end_time || null,
      price: body.price || 0,
      capacity: body.capacity || null,
      poster_url: body.poster_url || null,
      status: body.status || "draft",
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ event: data });
}

// DELETE — remove event
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const caller = await requireAdmin();
  if (!caller) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const admin = createAdminClient();
  const { error } = await admin.from("events").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
