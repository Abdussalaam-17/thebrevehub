"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  MapPin,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import AuthButtons from "./AuthButtons";
import MobileAuthBlock from "./MobileAuthBlock";

const LINKS = [
  { href: "/", label: "Home", desc: "Welcome to The Breve Hub" },
  { href: "/hall", label: "The Hall", desc: "See the space and amenities" },
  { href: "/pricing", label: "Pricing", desc: "Build your estimate" },
  { href: "/events", label: "Events", desc: "What's coming up" },
  { href: "/about", label: "About", desc: "Our story" },
  { href: "/contact", label: "Contact", desc: "Get in touch" },
  { href: "/faq", label: "FAQ", desc: "Answers in advance" },
];

const DARK_HERO_ROUTES = [
  "/",
  "/hall",
  "/pricing",
  "/book",
  "/events",
  "/about",
  "/contact",
  "/faq",
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const hasDarkHero = DARK_HERO_ROUTES.some(
    (r) => r === pathname || (r !== "/" && pathname.startsWith(r))
  );

  const solid = scrolled || !hasDarkHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [open]);

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid
            ? "glass-nav shadow-[0_1px_20px_-10px_rgba(10,15,28,0.15)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl font-display text-lg transition-colors ${
                solid ? "bg-ink text-gold" : "bg-gold text-ink"
              }`}
            >
              B
            </span>
            <span
              className={`font-display text-lg transition-colors md:text-xl ${
                solid ? "text-ink" : "text-cream"
              }`}
            >
              The <span className="italic text-gold">Breve</span> Hub
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.slice(0, 6).map((l) => {
              const active = pathname === l.href;

              // Explicit, non-overlapping states
              let className =
                "rounded-full px-4 py-2 text-sm font-medium transition-colors";

              if (solid) {
                // Solid navbar (glass) — dark text on cream
                if (active) {
                  className += " bg-ink text-cream hover:bg-ink-soft";
                } else {
                  className += " text-ink/80 hover:bg-ink/5 hover:text-ink";
                }
              } else {
                // Transparent navbar over dark hero — light text on dark
                if (active) {
                  className += " bg-gold text-ink hover:bg-gold-soft";
                } else {
                  className +=
                    " text-cream/90 hover:bg-cream/10 hover:text-cream";
                }
              }

              return (
                <Link key={l.href} href={l.href} className={className}>
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Book Now + Auth */}
          <div className="hidden items-center gap-2 lg:flex shrink-0">
            <Link href="/book" className="btn btn-gold btn-sm">
              Book Now
            </Link>
            <AuthButtons solid={solid} />
          </div>

          {/* Mobile: auth + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="hidden items-center gap-2 sm:flex">
              <AuthButtons solid={solid} />
            </div>

            <button
              onClick={() => setOpen(true)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                solid ? "text-ink hover:bg-ink/5" : "text-cream hover:bg-cream/10"
              }`}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/50 backdrop-blur-md transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute right-0 top-0 flex h-full w-[88%] max-w-md transform flex-col bg-cream shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink font-display text-lg text-gold">
                B
              </span>
              <span className="font-display text-lg text-ink">
                The <span className="italic text-gold">Breve</span> Hub
              </span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition hover:bg-ink/5"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
              Navigate
            </div>
            <ul className="space-y-1">
              {LINKS.map((l, i) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      style={{
                        transitionDelay: open ? `${100 + i * 40}ms` : "0ms",
                      }}
                      className={`group flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-300 ${
                        open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                      } ${
                        active
                          ? "bg-ink text-cream"
                          : "text-ink hover:bg-ink/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            active ? "bg-gold" : "bg-line"
                          }`}
                        />
                        <div>
                          <div className="font-display text-base leading-tight">
                            {l.label}
                          </div>
                          <div
                            className={`text-[11px] ${
                              active ? "text-cream/60" : "text-muted"
                            }`}
                          >
                            {l.desc}
                          </div>
                        </div>
                      </div>
                      <ArrowRight
                        className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${
                          active ? "text-gold" : "text-muted"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Auth block */}
            <MobileAuthBlock onClose={() => setOpen(false)} />

            {/* Contact block */}
            <div className="mt-6 rounded-2xl border border-line bg-cream-deep p-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                Visit Us
              </div>
              <div className="mt-3 flex items-start gap-3 text-sm text-ink">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                <span className="leading-snug">
                  No. 258 Awolowo Road, Molete, Ibadan
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3 text-sm text-ink">
                <Phone className="h-4 w-4 flex-shrink-0 text-gold" />
                <span>+234 801 234 5678</span>
              </div>
            </div>
          </nav>

          <div className="border-t border-line bg-cream p-5">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="btn btn-gold w-full"
              >
                Book Now
              </Link>
              <a
                href="https://wa.me/2348012345678"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline w-full"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
