import { config } from "@/lib/config";
import { MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-ink grain">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/images/hall-hero.svg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-ink" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24">
        <div className="max-w-3xl animate-fade-up">
          <div className="eyebrow text-gold">
            Molete · Ibadan
          </div>

          <h1 className="mt-8 text-5xl font-medium leading-[1.05] text-cream md:text-7xl">
            A refined space for
            <br />
            <span className="italic text-gold">exceptional</span> gatherings.
          </h1>

          <p className="lead mt-8 max-w-xl text-cream/70">
            The Breve Hub is Ibadan&apos;s premium 50-seater conference and training
            hall — thoughtfully appointed for events that demand more.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a href="#book" className="btn btn-gold">
              Reserve Your Date
            </a>
            <a href="#gallery" className="btn btn-ghost-light">
              Explore the Space
            </a>
          </div>

          <div className="mt-20 flex flex-wrap items-center gap-x-10 gap-y-4 text-xs uppercase tracking-[0.18em] text-cream/50">
            <span>50 Guests</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span>Full AV Setup</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span>₦35,000 / hour</span>
          </div>
        </div>
      </div>
    </section>
  );
}
