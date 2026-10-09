"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { config } from "@/lib/config";

export default function PricingPage() {
  const [hours, setHours] = useState(3);
  const [selected, setSelected] = useState<string[]>([]);

  const hallTotal = hours * config.pricing.hourly;
  const extrasTotal = useMemo(
    () => config.extras.filter((e) => selected.includes(e.id)).reduce((s, e) => s + e.price, 0),
    [selected]
  );
  const total = hallTotal + extrasTotal;

  const toggle = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <>
      <section className="bg-ink pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow text-gold">Pricing</div>
            <h1 className="mt-6 text-4xl text-cream sm:text-5xl md:text-6xl">
              One rate. <span className="italic text-gold">Zero surprises</span>.
            </h1>
            <p className="lead mt-6 text-cream/60">
              Build your event in seconds. See the total before you book.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Calculator */}
          <div className="glass rounded-3xl p-8 lg:col-span-3">
            <div className="flex items-baseline justify-between">
              <span className="label">Hours</span>
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

            <div className="mt-10">
              <div className="label">Media services</div>
              <div className="mt-3 space-y-2">
                {config.extras.map((x) => (
                  <label
                    key={x.id}
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                      selected.includes(x.id)
                        ? "border-gold bg-gold/5"
                        : "border-line hover:border-ink/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(x.id)}
                      onChange={() => toggle(x.id)}
                      className="mt-1 h-4 w-4 accent-gold"
                    />
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-medium text-ink">{x.title}</span>
                        <span className="text-sm text-gold">
                          +₦{x.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted">{x.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-3xl bg-ink p-8 text-cream">
              <div className="text-[11px] uppercase tracking-[0.18em] text-gold">
                Estimate
              </div>
              <div className="mt-6 space-y-3 border-b border-cream/10 pb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-cream/60">Hall · {hours}h × ₦35,000</span>
                  <span>₦{hallTotal.toLocaleString()}</span>
                </div>
                {extrasTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-cream/60">Extras</span>
                    <span>₦{extrasTotal.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="mt-6 flex items-baseline justify-between">
                <span className="text-sm text-cream/60">Total</span>
                <span className="font-display text-3xl text-gold">
                  ₦{total.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-cream/40">
                <span>Deposit (50%)</span>
                <span>₦{(total / 2).toLocaleString()}</span>
              </div>

              <Link href="/book" className="btn btn-gold mt-8 w-full">
                Book This <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
