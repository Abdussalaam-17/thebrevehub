import { config } from "@/lib/config";
import * as Icons from "lucide-react";

export default function Included() {
  return (
    <section id="included" className="section">
      <div className="mb-16 max-w-2xl">
        <div className="eyebrow">Included</div>
        <h2 className="mt-6 text-4xl text-ink md:text-5xl">
          Everything you need, <span className="italic text-gold">nothing you don&apos;t</span>.
        </h2>
        <p className="lead mt-6">
          One transparent rate. Seven considered amenities. Zero
          last-minute surprises.
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {config.included.map((item) => {
          const Icon = (Icons as any)[item.icon] ?? Icons.Check;
          return (
            <div
              key={item.title}
              className="group relative bg-paper p-8 transition-colors hover:bg-cream"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-sm border border-line bg-cream text-gold transition-colors group-hover:border-gold">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-sm border border-line bg-cream px-8 py-6">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted">Rate</div>
          <div className="mt-1 font-display text-2xl text-ink">
            ₦35,000 <span className="text-base text-muted">/ hour</span>
          </div>
        </div>
        <a href="#book" className="btn btn-ink">
          Check Availability
        </a>
      </div>
    </section>
  );
}
