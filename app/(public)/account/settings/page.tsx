export const instant = false;

import { redirect } from "next/navigation";
import Link from "next/link";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/current";
import { ArrowLeft } from "lucide-react";

export default async function SettingsPage() {
  await connection();

  const session = await getSession();
  if (!session) redirect("/login?next=/account/settings");
  if (session.type === "admin") redirect("/admin");

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20 md:pt-36">
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Back to account
        </Link>

        <h1 className="font-display text-4xl text-ink md:text-5xl">Settings</h1>
        <p className="lead mt-3">Manage your profile and security.</p>

        <div className="glass mt-10 rounded-3xl p-8">
          <h2 className="font-display text-xl text-ink">Profile</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label className="label">Full name</label>
              <input defaultValue={session.full_name || ""} className="input" />
            </div>
            <div>
              <label className="label">Email</label>
              <input defaultValue={session.email || ""} className="input" disabled />
            </div>
            <div>
              <label className="label">Phone</label>
              <input defaultValue={session.phone || ""} className="input" />
            </div>
            <button className="btn btn-ink">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
