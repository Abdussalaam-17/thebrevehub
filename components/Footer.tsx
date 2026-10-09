"use client";
import Link from "next/link";
import { Camera, MessageCircle, Share2, MapPin, Phone, Mail } from "lucide-react";
import { config } from "@/lib/config";

const CURRENT_YEAR = 2026;

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/70">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold font-display text-lg text-ink">
                B
              </span>
              <span className="font-display text-xl text-cream">
                The <span className="italic text-gold">Breve</span> Hub
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              {config.brand.tagline}
            </p>

            <div className="mt-8 flex gap-3">
              <a
                href={config.brand.socials.instagram}
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 transition hover:border-gold hover:text-gold"
              >
                <Camera className="h-4 w-4" />
              </a>
              <a
                href={config.brand.socials.facebook}
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 transition hover:border-gold hover:text-gold"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${config.brand.whatsapp}`}
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 transition hover:border-gold hover:text-gold"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <div className="text-[11px] uppercase tracking-[0.18em] text-gold">
              Explore
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/hall" className="transition hover:text-gold">The Hall</Link></li>
              <li><Link href="/pricing" className="transition hover:text-gold">Pricing</Link></li>
              <li><Link href="/events" className="transition hover:text-gold">Events</Link></li>
              <li><Link href="/about" className="transition hover:text-gold">About</Link></li>
              <li><Link href="/faq" className="transition hover:text-gold">FAQ</Link></li>
              <li><Link href="/contact" className="transition hover:text-gold">Contact</Link></li>
            </ul>
          </div>

          {/* Visit */}
          <div className="md:col-span-3">
            <div className="text-[11px] uppercase tracking-[0.18em] text-gold">
              Visit
            </div>
            <div className="mt-4 flex items-start gap-3 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
              <span className="leading-relaxed">{config.venue.address}</span>
            </div>
            <p className="mt-4 text-xs italic text-cream/40">
              {config.venue.directionsNote}
            </p>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <div className="text-[11px] uppercase tracking-[0.18em] text-gold">
              Contact
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                <span>{config.brand.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                <span className="break-all">{config.brand.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-14 flex flex-col gap-4 border-t border-cream/10 pt-6 text-xs text-cream/40 md:flex-row md:items-center md:justify-between">
          <span>© {CURRENT_YEAR} {config.brand.name}. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/faq" className="transition hover:text-gold">Terms</Link>
            <Link href="/faq" className="transition hover:text-gold">Privacy</Link>
            <Link href="/faq" className="transition hover:text-gold">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
