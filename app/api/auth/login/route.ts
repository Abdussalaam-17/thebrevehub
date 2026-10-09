import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    // Determine role — check admin_profiles first, then client_profiles
    const admin = createAdminClient();

    const { data: adminProfile } = await admin
      .from("admin_profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (adminProfile) {
      return NextResponse.json({
        ok: true,
        type: "admin",
        role: adminProfile.role,
        redirect: "/admin",
      });
    }

    const { data: clientProfile } = await admin
      .from("client_profiles")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (clientProfile) {
      return NextResponse.json({
        ok: true,
        type: "client",
        redirect: "/account",
      });
    }

    // Logged in but no profile — orphan. Sign out and reject.
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "No profile found for this account. Contact support." },
      { status: 403 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
