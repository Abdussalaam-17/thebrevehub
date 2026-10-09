"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  PartyPopper,
} from "lucide-react";
import Button from "@/components/admin/ui/Button";
import Badge from "@/components/admin/ui/Badge";
import EmptyState from "@/components/admin/ui/EmptyState";
import EventForm from "./EventForm";

type EventRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  host: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  price: number;
  capacity: number | null;
  poster_url: string | null;
  status: "draft" | "published" | "archived";
};

export default function EventsManager() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<EventRow | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/events");
    const data = await res.json();
    setEvents(data.events || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const closeModal = () => {
    setModal(null);
    setEditing(null);
  };

  const onSaved = () => {
    closeModal();
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {events.length} event{events.length === 1 ? "" : "s"}
          </h2>
          <p className="text-xs text-slate-500">
            Draft, publish, and manage what appears on /events
          </p>
        </div>
        <Button onClick={() => setModal("create")}>
          <Plus className="h-4 w-4" />
          New event
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16">
          <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={PartyPopper}
          title="No events yet"
          description="Create your first event — it will show up on the public /events page once published."
          action={
            <Button onClick={() => setModal("create")}>
              <Plus className="h-4 w-4" /> Create event
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((e) => (
            <div
              key={e.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md"
            >
              <div className="relative aspect-video bg-slate-100">
                {e.poster_url ? (
                  <img
                    src={e.poster_url}
                    alt={e.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <PartyPopper className="h-8 w-8 text-slate-300" />
                  </div>
                )}
                <div className="absolute right-2 top-2">
                  <Badge
                    tone={
                      e.status === "published"
                        ? "green"
                        : e.status === "archived"
                        ? "slate"
                        : "amber"
                    }
                  >
                    {e.status}
                  </Badge>
                </div>
              </div>

              <div className="p-5">
                <div className="text-xs text-slate-500">
                  {e.date}
                  {e.start_time ? ` · ${e.start_time.slice(0, 5)}` : ""}
                </div>
                <h3 className="mt-1 font-display text-lg leading-snug text-slate-900">
                  {e.title}
                </h3>
                {e.host && (
                  <div className="mt-1 text-xs text-slate-500">
                    by {e.host}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => {
                      setEditing(e);
                      setModal("edit");
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(e.id)}
                    disabled={deleting === e.id}
                  >
                    {deleting === e.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {modal === "create" ? "New event" : "Edit event"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <EventForm
                initial={editing || undefined}
                onSaved={onSaved}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
