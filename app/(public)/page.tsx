import Link from "next/link";
import { ArrowRight, MapPin, Users, Sparkles } from "lucide-react";
import { images } from "@/lib/images";
import { config } from "@/lib/config";

export default function HomePage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(${images.heroPrimary})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/85 to-ink/60" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="max-w-3xl">
            <div className="eyebrow text-gold animate-fade-up">
              Molete · Ibadan
            </div>

            <h1 className="mt-6 text-4xl font-medium leading-[1.05] text-cream sm:text-5xl md:text-6xl lg:text-7xl animate-fade-up delay-100">
              A refined space for
              <br />
              <span className="italic text-gold">exceptional</span> gatherings.
            </h1>

            <p className="lead mt-6 max-w-xl text-cream/70 animate-fade-up delay-200">
              {config.brand.venue} is Ibadan&apos;s premium 50-seater conference
              and training hall — thoughtfully appointed for events that
              demand more.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up delay-300">
              <Link href="/book" className="btn btn-gold">
                Reserve Your Date <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/hall" className="btn btn-ghost-light">
                Explore the Space
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 text-xs uppercase tracking-[0.18em] text-cream/50 animate-fade-up delay-400">
              <span className="inline-flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-gold" /> 50 Guests
              </span>
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-gold" /> Full AV Setup
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-gold" /> Awolowo Road
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK STATS STRIP ================= */}
      <section className="border-b border-line bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-line md:grid-cols-4">
          {[
            { k: "50", l: "Seats" },
            { k: "₦35k", l: "Per Hour" },
            { k: "7", l: "Amenities" },
            { k: "24/7", l: "Support" },
          ].map((s) => (
            <div key={s.l} className="bg-cream px-6 py-8 text-center md:py-10">
              <div className="font-display text-3xl text-ink md:text-4xl">{s.k}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HALL PREVIEW ================= */}
      <section className="section bg-cream">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <div className="eyebrow">The Space</div>
            <h2 className="mt-6 text-3xl text-ink sm:text-4xl md:text-5xl">
              Every detail, <span className="italic text-gold">considered</span>.
            </h2>
            <p className="lead mt-6">
              A room designed for focus, presence, and the quiet confidence of
              a well-hosted event. From the smart display to the LED stage
              lighting, everything is ready the moment you walk in.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6">
              {config.included.slice(0, 6).map((i) => (
                <div key={i.title}>
                  <div className="font-display text-lg text-ink">{i.title}</div>
                  <div className="mt-1 text-xs text-muted">{i.desc}</div>
                </div>
              ))}
            </div>

            <Link href="/hall" className="btn btn-ink mt-10">
              See the Full Hall <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={images.hall[0]}
                alt="The Breve Hub interior"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden h-40 w-40 overflow-hidden rounded-2xl border-4 border-cream shadow-xl md:block">
              <img
                src={images.hall[1]}
                alt="Hall detail"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="glass absolute -right-4 top-8 hidden rounded-2xl px-5 py-4 md:block">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted">
                Rate
              </div>
              <div className="mt-1 font-display text-xl text-ink">₦35,000</div>
              <div className="text-xs text-muted">per hour</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRICING PREVIEW ================= */}
      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-12 max-w-2xl md:mb-16">
            <div className="eyebrow text-gold">Simple Pricing</div>
            <h2 className="mt-6 text-3xl text-cream sm:text-4xl md:text-5xl">
              One rate. <span className="italic text-gold">Zero surprises</span>.
            </h2>
            <p className="lead mt-6 text-cream/60">
              Everything included. Add media services only when you need them.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {config.extras.slice(0, 3).map((x) => (
              <div
                key={x.id}
                className="glass-dark rounded-3xl p-7 text-cream transition hover:-translate-y-1"
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-gold">
                  Add-on
                </div>
                <h3 className="mt-3 font-display text-2xl">{x.title}</h3>
                <p className="mt-2 text-sm text-cream/60">{x.desc}</p>
                <div className="mt-6 font-display text-3xl text-gold">
                  +₦{x.price.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/pricing" className="btn btn-gold">
              View Full Pricing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative overflow-hidden bg-cream-deep py-24 md:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
          style={{ backgroundImage: `url(${images.ctaBackground})` }}
        />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <div className="eyebrow justify-center">Ready When You Are</div>
          <h2 className="mt-6 text-3xl text-ink sm:text-4xl md:text-5xl">
            Let&apos;s host something <span className="italic text-gold">remarkable</span>.
          </h2>
          <p className="lead mt-6">
            Check availability, pick your date, and pay 50% to lock it in.
            The rest is taken care of.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/book" className="btn btn-ink">
              Book the Hall <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
