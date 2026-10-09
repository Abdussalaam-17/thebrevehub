import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { email, password, username, inviteCode } = await req.json();

    // ---------- Validation ----------
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, username, and password are required" },
        { status: 400 }
      );
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // ---------- Invite code gate ----------
    const required = process.env.ADMIN_INVITE_CODE;
    if (required && inviteCode !== required) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 403 });
    }

    const supabase = await createClient();

    // ---------- Create auth user ----------
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (signUpError || !signUpData.user) {
      return NextResponse.json(
        { error: signUpError?.message || "Signup failed" },
        { status: 400 }
      );
    }

    // ---------- Determine role ----------
    // Use service-role client to count admins (bypasses RLS)
    const admin = createAdminClient();
    const { count } = await admin
      .from("admin_profiles")
      .select("*", { count: "exact", head: true });

    const role = !count || count === 0 ? "owner" : "manager";

    // ---------- Create admin_profiles row ----------
    const { error: profileError } = await admin.from("admin_profiles").insert({
      id: signUpData.user.id,
      username,
      role,
    });

    if (profileError) {
      // Rollback auth user if profile insert fails
      await admin.auth.admin.deleteUser(signUpData.user.id);
      return NextResponse.json(
        { error: "Could not create admin profile: " + profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, role });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
