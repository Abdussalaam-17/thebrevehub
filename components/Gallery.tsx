"use client";
import { useState } from "react";
import { X } from "lucide-react";

const photos = [
  "/images/hall-1.svg",
  "/images/hall-2.svg",
  "/images/hall-3.svg",
  "/images/hall-4.svg",
  "/images/hall-5.svg",
  "/images/hall-6.svg",
];

export default function Gallery() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="gallery" className="section bg-cream">
      <div className="mb-16 max-w-2xl">
        <div className="eyebrow">The Space</div>
        <h2 className="mt-6 text-4xl text-ink md:text-5xl">
          Every detail, <span className="italic text-gold">considered</span>.
        </h2>
        <p className="lead mt-6">
          A room designed for focus, presence, and the quiet confidence of
          a well-hosted event.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {photos.map((src, i) => (
          <button
            key={i}
            onClick={() => setOpen(src)}
            className={`group relative overflow-hidden rounded-sm bg-ink ${
              i === 0 ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2" : ""
            }`}
            style={{ aspectRatio: i === 0 ? "1/1" : "4/3" }}
          >
            <img
              src={src}
              alt={`Hall view ${i + 1}`}
              className="h-full w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
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
          <img src={open} alt="Hall" className="max-h-[90vh] max-w-full rounded-sm shadow-2xl" />
        </div>
      )}
    </section>
  );
}
