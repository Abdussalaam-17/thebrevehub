"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { images } from "@/lib/images";
import { config } from "@/lib/config";
import * as Icons from "lucide-react";

export default function HallPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <section className="bg-ink pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow text-gold">The Hall</div>
            <h1 className="mt-6 text-4xl text-cream sm:text-5xl md:text-6xl">
              A space built for <span className="italic text-gold">presence</span>.
            </h1>
            <p className="lead mt-6 text-cream/60">
              Fifty seats. Full AV. Natural light. Everything tuned for the
              moment your audience walks in.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section bg-cream">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {images.hall.map((src, i) => (
            <button
              key={i}
              onClick={() => setOpen(src)}
              className={`group relative overflow-hidden rounded-2xl bg-ink ${
                i === 0 ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2" : ""
              }`}
              style={{ aspectRatio: i === 0 ? "1/1" : "4/3" }}
            >
              <img
                src={src}
                alt={`Hall view ${i + 1}`}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </button>
          ))}
        </div>

        {open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 backdrop-blur"
            onClick={() => setOpen(null)}
          >
            <button
              className="absolute right-6 top-6 text-cream transition hover:text-gold"
              onClick={() => setOpen(null)}
              aria-label="Close"
            >
              <X className="h-7 w-7" />
            </button>
            <img
              src={open}
              alt="Hall"
              className="max-h-[90vh] max-w-full rounded-2xl shadow-2xl"
            />
          </div>
        )}
      </section>

      {/* Included */}
      <section className="section">
        <div className="mb-12 max-w-2xl md:mb-16">
          <div className="eyebrow">Included</div>
          <h2 className="mt-6 text-3xl text-ink sm:text-4xl md:text-5xl">
            Everything you need, <span className="italic text-gold">nothing you don&apos;t</span>.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {config.included.map((item) => {
            const Icon = (Icons as any)[item.icon] ?? Icons.Check;
            return (
              <div key={item.title} className="glass rounded-3xl p-7">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-gold">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-xl text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
