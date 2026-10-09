export const instant = false;

import { notFound } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Clock, Users } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function EventDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();

  const { slug } = await params;
  const admin = createAdminClient();
  const { data: event } = await admin
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!event) notFound();

  return (
    <>
      <section className="relative min-h-[70vh] overflow-hidden bg-ink pt-32">
        {event.poster_url ? (
          <img
            src={event.poster_url}
            alt={event.title}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-soft to-ink" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/60" />

        <div className="relative mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-28">
          <div className="eyebrow text-gold">Upcoming Event</div>
          <h1 className="mt-6 text-4xl text-cream sm:text-5xl md:text-6xl">
            {event.title}
          </h1>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-cream/80">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold" />
              {event.date}
            </span>
            {event.start_time && (
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold" />
                {event.start_time.slice(0, 5)}
                {event.end_time ? ` – ${event.end_time.slice(0, 5)}` : ""}
              </span>
            )}
            {event.host && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" />
                {event.host}
              </span>
            )}
            {event.capacity && (
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-gold" />
                {event.capacity} seats
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="mx-auto max-w-3xl">
          {event.description && (
            <p className="whitespace-pre-line text-lg leading-relaxed text-ink">
              {event.description}
            </p>
          )}

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/book" className="btn btn-gold">
              Reserve a Seat <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/events" className="btn btn-outline">
              All Events
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
