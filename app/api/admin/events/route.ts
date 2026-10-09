import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Check that the caller is an admin
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("admin_profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  return profile ? { id: user.id, role: profile.role } : null;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// GET — list all events
export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ events: data });
}

// POST — create event
export async function POST(req: Request) {
  const caller = await requireAdmin();
  if (!caller) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    description,
    host,
    date,
    start_time,
    end_time,
    price,
    capacity,
    poster_url,
    status,
  } = body;

  if (!title || !date) {
    return NextResponse.json(
      { error: "Title and date are required" },
      { status: 400 }
    );
  }

  // Generate unique slug
  let slug = slugify(title);
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("events")
    .select("slug")
    .ilike("slug", `${slug}%`);

  if (existing && existing.length > 0) {
    slug = `${slug}-${existing.length + 1}`;
  }

  const { data, error } = await admin
    .from("events")
    .insert({
      slug,
      title,
      description: description || null,
      host: host || null,
      date,
      start_time: start_time || null,
      end_time: end_time || null,
      price: price || 0,
      capacity: capacity || null,
      poster_url: poster_url || null,
      status: status || "draft",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ event: data });
}
