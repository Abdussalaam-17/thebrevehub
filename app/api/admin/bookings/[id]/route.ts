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

const VALID_STATUSES = [
  "pending",
  "paid",
  "confirmed",
  "cancelled",
  "completed",
];

// PATCH — update any field
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

  // Only allow certain fields to be updated
  const allowed: Record<string, any> = {};
  const fields = [
    "date",
    "hours",
    "client_name",
    "email",
    "phone",
    "event_type",
    "attendees",
    "total",
    "deposit",
    "balance",
    "status",
    "notes",
    "payment_ref",
  ];
  for (const f of fields) {
    if (f in body) allowed[f] = body[f];
  }

  if (allowed.status && !VALID_STATUSES.includes(allowed.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("bookings")
    .update(allowed)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ booking: data });
}

// DELETE — remove booking
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
  const { error } = await admin.from("bookings").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
