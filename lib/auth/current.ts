import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type SessionInfo =
  | {
      type: "admin";
      id: string;
      email: string | null;
      username: string;
      role: "owner" | "manager" | "staff";
    }
  | {
      type: "client";
      id: string;
      email: string | null;
      full_name: string | null;
      username: string | null;
      phone: string | null;
    }
  | null;

export async function getSession(): Promise<SessionInfo> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const admin = createAdminClient();

  const { data: adminProfile } = await admin
    .from("admin_profiles")
    .select("username, role")
    .eq("id", user.id)
    .maybeSingle();

  if (adminProfile) {
    return {
      type: "admin",
      id: user.id,
      email: user.email ?? null,
      username: adminProfile.username,
      role: adminProfile.role,
    };
  }

  const { data: clientProfile } = await admin
    .from("client_profiles")
    .select("full_name, username, phone")
    .eq("id", user.id)
    .maybeSingle();

  if (clientProfile) {
    return {
      type: "client",
      id: user.id,
      email: user.email ?? null,
      full_name: clientProfile.full_name,
      username: clientProfile.username,
      phone: clientProfile.phone,
    };
  }

  return null;
}

export async function requireAdmin() {
  const s = await getSession();
  if (!s || s.type !== "admin") {
    return null;
  }
  return s;
}

export async function requireClient() {
  const s = await getSession();
  if (!s || s.type !== "client") {
    return null;
  }
  return s;
}
