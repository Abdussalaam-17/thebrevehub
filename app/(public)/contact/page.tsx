import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { config } from "@/lib/config";

export default function ContactPage() {
  return (
    <>
      <section className="bg-ink pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow text-gold">Contact</div>
            <h1 className="mt-6 text-4xl text-cream sm:text-5xl md:text-6xl">
              Let&apos;s talk.
            </h1>
            <p className="lead mt-6 text-cream/60">
              Questions about availability, pricing, or hosting your event?
              Send us a message.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="grid gap-10 lg:grid-cols-5">
          <form className="glass space-y-5 rounded-3xl p-8 lg:col-span-3">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="label">Name</label>
                <input className="input" required />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" required />
              </div>
            </div>
            <div>
              <label className="label">Subject</label>
              <input className="input" />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea className="input min-h-[140px]" required />
            </div>
            <button type="button" className="btn btn-gold w-full">
              Send Message
            </button>
          </form>

          <div className="space-y-8 lg:col-span-2">
            <div className="space-y-6">
              <ContactItem icon={<MapPin />} label="Address" value={config.venue.address} />
              <ContactItem icon={<Phone />} label="Phone" value={config.brand.phone} />
              <ContactItem icon={<Mail />} label="Email" value={config.brand.email} />
            </div>

            <a
              href={`https://wa.me/${config.brand.whatsapp}`}
              className="btn btn-ink w-full"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>

            <div className="overflow-hidden rounded-3xl border border-line">
              <iframe src={config.venue.mapEmbed} className="h-64 w-full" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-2xl border border-line bg-paper p-3 text-gold">
        <span className="block h-4 w-4 [&>svg]:h-full [&>svg]:w-full">{icon}</span>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
        <div className="mt-1 text-sm text-ink">{value}</div>
      </div>
    </div>
  );
}
