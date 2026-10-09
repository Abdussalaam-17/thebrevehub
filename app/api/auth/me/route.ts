import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ user: null, profile: null });

  const admin = createAdminClient();

  const { data: adminProfile } = await admin
    .from("admin_profiles")
    .select("username, role")
    .eq("id", user.id)
    .maybeSingle();

  if (adminProfile) {
    return NextResponse.json({
      user: { id: user.id, email: user.email },
      profile: { type: "admin", ...adminProfile },
    });
  }

  const { data: clientProfile } = await admin
    .from("client_profiles")
    .select("full_name, username, phone")
    .eq("id", user.id)
    .maybeSingle();

  if (clientProfile) {
    return NextResponse.json({
      user: { id: user.id, email: user.email },
      profile: { type: "client", ...clientProfile },
    });
  }

  return NextResponse.json({ user, profile: null });
}
