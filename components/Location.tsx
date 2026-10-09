import { config } from "@/lib/config";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Location() {
  return (
    <section id="location" className="section bg-cream">
      <div className="mb-16 max-w-2xl">
        <div className="eyebrow">Find Us</div>
        <h2 className="mt-6 text-4xl text-ink md:text-5xl">
          Easy to reach. <span className="italic text-gold">Easy to find</span>.
        </h2>
        <p className="lead mt-6">
          Right on Awolowo Road — no stressful turns, no confusing side
          streets. Just park and walk in.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-5">
        <div className="overflow-hidden rounded-sm border border-line md:col-span-3">
          <iframe
            src={config.venue.mapEmbed}
            className="h-96 w-full grayscale-[20%]"
            loading="lazy"
          />
        </div>

        <div className="space-y-8 md:col-span-2">
          <Info icon={<MapPin />} label="Address" value={config.venue.address} />
          <Info icon={<Phone />} label="Phone" value={config.brand.phone} />
          <Info icon={<Mail />} label="Email" value={config.brand.email} />

          <div className="border-t border-line pt-6">
            <p className="font-display text-lg italic text-gold">
              &ldquo;{config.venue.directionsNote}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-sm border border-line bg-paper p-2.5 text-gold">
        <span className="block h-4 w-4 [&>svg]:h-full [&>svg]:w-full">{icon}</span>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
        <div className="mt-1 text-sm text-ink">{value}</div>
      </div>
    </div>
  );
}
