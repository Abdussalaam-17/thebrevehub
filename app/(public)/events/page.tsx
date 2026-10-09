export const instant = false;

import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function EventsPage() {
  await connection();

  const admin = createAdminClient();
  const { data: events } = await admin
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true });

  return (
    <>
      <section className="bg-ink pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow text-gold">Upcoming</div>
            <h1 className="mt-6 text-4xl text-cream sm:text-5xl md:text-6xl">
              Events at <span className="italic text-gold">The Breve Hub</span>.
            </h1>
            <p className="lead mt-6 text-cream/70">
              Curated gatherings hosted in our space. Reserve your seat or get
              in touch to host your own.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        {!events || events.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-line bg-paper p-12 text-center">
            <Calendar className="mx-auto h-10 w-10 text-muted" />
            <h2 className="mt-4 font-display text-2xl text-ink">
              No upcoming events yet
            </h2>
            <p className="mt-2 text-sm text-muted">
              Check back soon, or reach out to host your own event here.
            </p>
            <Link href="/contact" className="btn btn-gold mt-6">
              Get in touch
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((e: any) => (
              <Link
                key={e.id}
                href={`/events/${e.slug}`}
                className="glass group grid gap-6 overflow-hidden rounded-3xl md:grid-cols-3"
              >
                <div className="aspect-video overflow-hidden md:aspect-auto">
                  {e.poster_url ? (
                    <img
                      src={e.poster_url}
                      alt={e.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-ink">
                      <Calendar className="h-10 w-10 text-gold" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between p-6 md:col-span-2 md:p-8">
                  <div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gold" />
                        {e.date}
                        {e.start_time ? ` · ${e.start_time.slice(0, 5)}` : ""}
                      </span>
                      {e.host && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-gold" />
                          {e.host}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-4 font-display text-2xl text-ink md:text-3xl">
                      {e.title}
                    </h2>
                    {e.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-muted">
                        {e.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold">
                    View details
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
