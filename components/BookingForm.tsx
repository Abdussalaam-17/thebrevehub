"use client";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import BookingCalendar from "./BookingCalendar";
import { config } from "@/lib/config";
import { Check, Clock, Sparkles } from "lucide-react";

export default function BookingForm() {
  const [date, setDate] = useState<Date | null>(null);
  const [hours, setHours] = useState(3);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
  });
  const [bookedDates] = useState<string[]>([]);

  const extrasTotal = useMemo(
    () =>
      config.extras
        .filter((e) => selectedExtras.includes(e.id))
        .reduce((s, e) => s + e.price, 0),
    [selectedExtras]
  );
  const hallTotal = hours * config.pricing.hourly;
  const total = hallTotal + extrasTotal;
  const deposit = Math.round((total * config.pricing.depositPercent) / 100);

  const toggleExtra = (id: string) =>
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return alert("Please pick a date first.");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: format(date, "yyyy-MM-dd"),
        hours,
        extras: selectedExtras,
        total,
        deposit,
        ...form,
      }),
    });
    const data = await res.json();
    if (data.authorization_url) window.location.href = data.authorization_url;
    else alert("Booking saved. Check /admin.");
  };

  return (
    <section id="book" className="section bg-ink">
      <div className="mb-14 max-w-2xl">
        <div className="eyebrow text-gold">Reservations</div>
        <h2 className="mt-6 text-4xl text-cream md:text-5xl">
          Secure your <span className="italic text-gold">date</span>.
        </h2>
        <p className="lead mt-6 text-cream/70">
          Pick a day, choose your hours, and pay 50% to lock it in.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* LEFT — Calendar + Extras */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-cream p-5 md:p-6">
            <BookingCalendar
              bookedDates={bookedDates}
              selected={date}
              onSelect={setDate}
            />
          </div>

          <div className="rounded-3xl border border-cream/10 bg-ink-soft p-6 md:p-8">
            <div className="mb-5 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" />
              <h3 className="font-display text-lg text-cream">
                Add media services
              </h3>
            </div>
            <div className="space-y-3">
              {config.extras.map((x) => {
                const selected = selectedExtras.includes(x.id);
                return (
                  <label
                    key={x.id}
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                      selected
                        ? "border-gold bg-gold/5"
                        : "border-cream/10 hover:border-cream/25"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleExtra(x.id)}
                      className="mt-1 h-4 w-4 accent-gold"
                    />
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-medium text-cream">
                          {x.title}
                        </span>
                        <span className="text-sm font-medium text-gold">
                          +₦{x.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-cream/50">{x.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — Form */}
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-3xl border border-cream/10 bg-ink-soft p-6 md:p-8"
        >
          {/* Hours */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold" />
                <span className="text-xs uppercase tracking-[0.18em] text-cream/60">
                  Hours
                </span>
              </div>
              <span className="font-display text-3xl text-gold">{hours}h</span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              value={hours}
              onChange={(e) => setHours(+e.target.value)}
              className="mt-4 w-full accent-gold"
            />
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-cream/40">
              <span>1h</span>
              <span>12h</span>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-3 border-y border-cream/10 py-6">
            <Row
              label={`Hall · ${hours}h × ₦${config.pricing.hourly.toLocaleString()}`}
              value={`₦${hallTotal.toLocaleString()}`}
            />
            {extrasTotal > 0 && (
              <Row
                label="Extras"
                value={`₦${extrasTotal.toLocaleString()}`}
              />
            )}
            <div className="pt-2">
              <Row
                label="Total"
                value={`₦${total.toLocaleString()}`}
                bold
              />
            </div>
            <Row
              label="Deposit (50%)"
              value={`₦${deposit.toLocaleString()}`}
              accent
            />
          </div>

          {/* Fields */}
          <div className="mt-6 space-y-5">
            {[
              { k: "name", label: "Full name", type: "text", ph: "Jane Doe" },
              {
                k: "email",
                label: "Email",
                type: "email",
                ph: "you@example.com",
              },
              {
                k: "phone",
                label: "WhatsApp number",
                type: "tel",
                ph: "+234 800 000 0000",
              },
              {
                k: "eventType",
                label: "Nature of event",
                type: "text",
                ph: "Team training, board meeting…",
              },
            ].map((f) => (
              <div key={f.k}>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/60">
                  {f.label}
                </label>
                <input
                  required
                  type={f.type}
                  placeholder={f.ph}
                  value={(form as any)[f.k]}
                  onChange={(e) =>
                    setForm({ ...form, [f.k]: e.target.value })
                  }
                  className="w-full rounded-2xl border border-cream/15 bg-cream/5 px-4 py-3.5 text-sm text-cream placeholder:text-cream/30 focus:border-gold focus:bg-cream/10 focus:outline-none focus:ring-4 focus:ring-gold/10"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="btn btn-gold mt-8 w-full"
          >
            <Check className="h-4 w-4" />
            Pay ₦{deposit.toLocaleString()} Deposit
          </button>
          <p className="mt-4 text-center text-xs text-cream/40">
            Balance due 48 hours before event · Secure payment via Paystack
          </p>
        </form>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between text-sm">
      <span className={bold ? "font-medium text-cream" : "text-cream/60"}>
        {label}
      </span>
      <span
        className={`${bold ? "font-display text-lg text-cream" : ""} ${
          accent ? "font-display text-base text-gold" : "text-cream/90"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
