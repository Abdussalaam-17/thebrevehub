import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSession } from "@/lib/auth/session";

// In-memory fallback for dev when Supabase isn't configured yet.
// Cleared on every server restart. For production, ALWAYS use Supabase.
declare global {
  // eslint-disable-next-line no-var
  var __fallbackAdmins:
    | { id: string; username: string; password_hash: string; role: "owner" | "manager" | "staff" }[]
    | undefined;
}
if (!global.__fallbackAdmins) global.__fallbackAdmins = [];

const usesSupabase = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: Request) {
  try {
    const { username, password, inviteCode } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
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

    const requiredCode = process.env.ADMIN_INVITE_CODE;
    if (requiredCode && inviteCode !== requiredCode) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 403 });
    }

    // ============ SUPABASE PATH ============
    if (usesSupabase()) {
      const supabase = createAdminClient();

      const { data: existing } = await supabase
        .from("admins")
        .select("id")
        .eq("username", username)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }

      const { count } = await supabase
        .from("admins")
        .select("*", { count: "exact", head: true });

      const role = !count || count === 0 ? "owner" : "manager";
      const password_hash = await bcrypt.hash(password, 10);

      const { data: admin, error } = await supabase
        .from("admins")
        .insert({ username, password_hash, role })
        .select()
        .single();

      if (error || !admin) {
        return NextResponse.json(
          { error: error?.message || "Failed to create account" },
          { status: 500 }
        );
      }

      await createSession({
        id: admin.id,
        username: admin.username,
        role: admin.role,
      });

      return NextResponse.json({ ok: true, role, mode: "supabase" });
    }

    // ============ FALLBACK PATH (dev only) ============
    const taken = global.__fallbackAdmins!.find((a) => a.username === username);
    if (taken) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    const role: "owner" | "manager" =
      global.__fallbackAdmins!.length === 0 ? "owner" : "manager";

    const password_hash = await bcrypt.hash(password, 10);
    const admin = {
      id: crypto.randomUUID(),
      username,
      password_hash,
      role,
    };
    global.__fallbackAdmins!.push(admin);

    await createSession({
      id: admin.id,
      username: admin.username,
      role: admin.role,
    });

    return NextResponse.json({ ok: true, role, mode: "fallback" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
