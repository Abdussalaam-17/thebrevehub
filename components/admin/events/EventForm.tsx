"use client";

import { useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import Button from "@/components/admin/ui/Button";

type EventRow = {
  id?: string;
  title: string;
  description: string | null;
  host: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  price: number;
  capacity: number | null;
  poster_url: string | null;
  status: "draft" | "published" | "archived";
};

const EMPTY: EventRow = {
  title: "",
  description: "",
  host: "",
  date: "",
  start_time: "",
  end_time: "",
  price: 0,
  capacity: null,
  poster_url: "",
  status: "draft",
};

export default function EventForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: Partial<EventRow>;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<EventRow>({
    ...EMPTY,
    ...(initial || {}),
    description: initial?.description ?? "",
    host: initial?.host ?? "",
    poster_url: initial?.poster_url ?? "",
    start_time: initial?.start_time ?? "",
    end_time: initial?.end_time ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof EventRow, v: any) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "events");

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }
    set("poster_url", data.url);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = form.id ? `/api/admin/events/${form.id}` : "/api/admin/events";
    const method = form.id ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }
    onSaved();
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Poster */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Poster image
        </label>
        {form.poster_url ? (
          <div className="relative overflow-hidden rounded-2xl border border-slate-200">
            <img
              src={form.poster_url}
              alt="Poster"
              className="h-48 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => set("poster_url", "")}
              className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-slate-900 shadow-md hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex h-32 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-amber-400 hover:bg-amber-50">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }}
            />
            <div className="text-center">
              {uploading ? (
                <>
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-amber-600" />
                  <div className="mt-2 text-xs text-slate-500">Uploading…</div>
                </>
              ) : (
                <>
                  <Upload className="mx-auto h-5 w-5 text-slate-400" />
                  <div className="mt-2 text-xs text-slate-500">
                    Click to upload a poster
                  </div>
                </>
              )}
            </div>
          </label>
        )}
      </div>

      <Field label="Title" required>
        <input
          required
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Startup Pitch Night"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
        />
      </Field>

      <Field label="Host">
        <input
          value={form.host ?? ""}
          onChange={(e) => set("host", e.target.value)}
          placeholder="Ibadan Tech Collective"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
        />
      </Field>

      <Field label="Description">
        <textarea
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          rows={4}
          placeholder="What's this event about?"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Date" required>
          <input
            required
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          />
        </Field>
        <Field label="Start time">
          <input
            type="time"
            value={form.start_time ?? ""}
            onChange={(e) => set("start_time", e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          />
        </Field>
        <Field label="End time">
          <input
            type="time"
            value={form.end_time ?? ""}
            onChange={(e) => set("end_time", e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ticket price (₦)">
          <input
            type="number"
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          />
        </Field>
        <Field label="Capacity">
          <input
            type="number"
            value={form.capacity ?? ""}
            onChange={(e) =>
              set("capacity", e.target.value ? Number(e.target.value) : null)
            }
            placeholder="50"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          />
        </Field>
      </div>

      <Field label="Status">
        <select
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
        >
          <option value="draft">Draft — not visible to public</option>
          <option value="published">Published — visible on /events</option>
          <option value="archived">Archived</option>
        </select>
      </Field>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : form.id ? "Save changes" : "Create event"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
