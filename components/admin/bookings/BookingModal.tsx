"use client";

import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import Button from "@/components/admin/ui/Button";
import Badge from "@/components/admin/ui/Badge";

type Booking = any;

export default function BookingModal({
  booking,
  onClose,
  onSaved,
}: {
  booking: Booking;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    client_name: booking.client_name,
    email: booking.email,
    phone: booking.phone,
    event_type: booking.event_type || "",
    date: booking.date,
    hours: booking.hours,
    attendees: booking.attendees || 0,
    total: booking.total,
    deposit: booking.deposit,
    balance: booking.balance,
    status: booking.status,
    notes: booking.notes || "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-900">
                {form.client_name || "Booking"}
              </h2>
              <Badge
                tone={
                  form.status === "paid" || form.status === "confirmed"
                    ? "green"
                    : form.status === "cancelled"
                    ? "red"
                    : "amber"
                }
              >
                {form.status}
              </Badge>
            </div>
            {booking.reference && (
              <div className="mt-1 font-mono text-xs text-slate-500">
                Ref: {booking.reference}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          {/* Client info */}
          <Section title="Client">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Name">
                <input
                  value={form.client_name}
                  onChange={(e) => set("client_name", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Email">
                <input
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Phone">
                <input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </Section>

          {/* Booking info */}
          <Section title="Booking">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Date">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Hours">
                <input
                  type="number"
                  value={form.hours}
                  onChange={(e) => set("hours", Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
              <Field label="Attendees">
                <input
                  type="number"
                  value={form.attendees}
                  onChange={(e) => set("attendees", Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
              <Field label="Event type">
                <input
                  value={form.event_type}
                  onChange={(e) => set("event_type", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </Section>

          {/* Amount */}
          <Section title="Payment">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Total (₦)">
                <input
                  type="number"
                  value={form.total}
                  onChange={(e) => set("total", Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
              <Field label="Deposit (₦)">
                <input
                  type="number"
                  value={form.deposit}
                  onChange={(e) => set("deposit", Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
              <Field label="Balance (₦)">
                <input
                  type="number"
                  value={form.balance}
                  onChange={(e) => set("balance", Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
            </div>
          </Section>

          {/* Status */}
          <Section title="Status">
            <div className="flex flex-wrap gap-2">
              {["pending", "paid", "confirmed", "cancelled", "completed"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => set("status", s)}
                    className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                      form.status === s
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                )
              )}
            </div>
          </Section>

          {/* Notes */}
          <Section title="Internal notes">
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Private notes only admins see…"
              className={inputClass}
            />
          </Section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <div className="text-xs text-slate-500">
            Created {new Date(booking.created_at).toLocaleString()}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </label>
      {children}
    </div>
  );
}
