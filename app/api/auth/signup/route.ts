import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const log = (msg: string, data?: any) => {
  console.log(`[signup] ${msg}`, data ? JSON.stringify(data, null, 2) : "");
};

export async function POST(req: Request) {
  try {
    const { email, password, username, phone } = await req.json();

    log("Request received", { email, username });

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

    // ---------- Env sanity check ----------
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      log("❌ SUPABASE_SERVICE_ROLE_KEY is missing!");
      return NextResponse.json(
        { error: "Server misconfigured: missing service role key" },
        { status: 500 }
      );
    }
    log("Service role key present");

    const admin = createAdminClient();

    // ---------- Check if email is an approved admin ----------
    let isAdminEmail = false;
    try {
      const { data: adminEmailRow, error: lookupErr } = await admin
        .from("admin_emails")
        .select("email")
        .ilike("email", email)
        .maybeSingle();

      if (lookupErr) {
        log("admin_emails lookup error", lookupErr);
      } else {
        isAdminEmail = !!adminEmailRow;
        log("admin_emails result", { found: isAdminEmail, row: adminEmailRow });
      }
    } catch (err: any) {
      log("admin_emails lookup threw", err?.message);
    }

    log("Decision", { isAdminEmail, role: isAdminEmail ? "admin" : "client" });

    // ---------- Create auth user ----------
    const supabase = await createClient();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (signUpError || !signUpData.user) {
      log("❌ Auth signup failed", signUpError);
      return NextResponse.json(
        { error: signUpError?.message || "Signup failed" },
        { status: 400 }
      );
    }

    log("✅ Auth user created", { id: signUpData.user.id });
    const userId = signUpData.user.id;

    // ---------- Create profile based on role ----------
    if (isAdminEmail) {
      // Count existing admins
      const { count, error: countErr } = await admin
        .from("admin_profiles")
        .select("*", { count: "exact", head: true });

      if (countErr) {
        log("admin count error", countErr);
      }

      const role = !count || count === 0 ? "owner" : "manager";
      log("Inserting admin_profiles", { userId, username, role, existingCount: count });

      const { data: inserted, error: profileError } = await admin
        .from("admin_profiles")
        .insert({ id: userId, username, role })
        .select()
        .single();

      if (profileError) {
        log("❌ admin_profiles insert FAILED", profileError);

        // Rollback auth user
        await admin.auth.admin.deleteUser(userId);
        log("Rolled back auth user");

        return NextResponse.json(
          { error: "Could not create admin profile: " + profileError.message },
          { status: 500 }
        );
      }

      log("✅ admin_profiles inserted", inserted);

      return NextResponse.json({
        ok: true,
        role,
        type: "admin",
        redirect: "/admin",
      });
    }

    // Client path
    log("Inserting client_profiles", { userId, username });

    const { data: inserted, error: profileError } = await admin
      .from("client_profiles")
      .insert({
        id: userId,
        full_name: username,
        username,
        phone: phone || null,
      })
      .select()
      .single();

    if (profileError) {
      log("❌ client_profiles insert FAILED", profileError);
      await admin.auth.admin.deleteUser(userId);
      log("Rolled back auth user");

      return NextResponse.json(
        { error: "Could not create profile: " + profileError.message },
        { status: 500 }
      );
    }

    log("✅ client_profiles inserted", inserted);

    return NextResponse.json({
      ok: true,
      role: "client",
      type: "client",
      redirect: "/account",
    });
  } catch (err: any) {
    console.error("[signup] 💥 Unexpected error:", err);
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
