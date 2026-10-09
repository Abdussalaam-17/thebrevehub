"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Trash2,
  CalendarCheck,
  DollarSign,
  Ban,
  Clock,
} from "lucide-react";
import Button from "@/components/admin/ui/Button";
import Badge from "@/components/admin/ui/Badge";
import EmptyState from "@/components/admin/ui/EmptyState";
import BookingModal from "./BookingModal";

type Booking = {
  id: string;
  reference: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  hours: number;
  client_name: string;
  email: string;
  phone: string;
  event_type: string | null;
  attendees: number | null;
  extras: any;
  total: number;
  deposit: number;
  balance: number;
  status: "pending" | "paid" | "confirmed" | "cancelled" | "completed";
  payment_ref: string | null;
  notes: string | null;
  created_at: string;
};

const STATUS_TONE: Record<Booking["status"], any> = {
  pending: "amber",
  paid: "blue",
  confirmed: "green",
  cancelled: "red",
  completed: "slate",
};

export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Booking["status"]>("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setBookings(data.bookings || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = bookings;
    if (filter !== "all") {
      list = list.filter((b) => b.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.client_name.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.phone.toLowerCase().includes(q) ||
          (b.event_type || "").toLowerCase().includes(q) ||
          (b.reference || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, filter, search]);

  const updateStatus = async (id: string, status: Booking["status"]) => {
    setBusyId(id);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    load();
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking permanently?")) return;
    setBusyId(id);
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    setBusyId(null);
    load();
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: bookings.length,
      pending: 0,
      paid: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
    };
    bookings.forEach((b) => {
      c[b.status] = (c[b.status] || 0) + 1;
    });
    return c;
  }, [bookings]);

  return (
    <div>
      {/* Filters bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, reference…"
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            <span>Showing {filtered.length} of {bookings.length}</span>
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {(
            ["all", "pending", "paid", "confirmed", "cancelled", "completed"] as const
          ).map((s) => {
            const active = filter === s;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {s} <span className="opacity-60">({counts[s]})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20">
          <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title={bookings.length === 0 ? "No bookings yet" : "No matches"}
          description={
            bookings.length === 0
              ? "When clients book the hall, their bookings will appear here."
              : "Try a different filter or search term."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {b.client_name}
                    </div>
                    <div className="text-xs text-slate-500">{b.email}</div>
                    <div className="text-xs text-slate-500">{b.phone}</div>
                    {b.reference && (
                      <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                        {b.reference}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{b.date}</div>
                    <div className="text-xs text-slate-500">{b.hours}h</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {b.event_type || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">
                      ₦{Number(b.total).toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      Deposit ₦{Number(b.deposit).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[b.status]}>{b.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* View */}
                      <IconBtn
                        title="View details"
                        onClick={() => setSelected(b)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </IconBtn>

                      {/* Confirm */}
                      {b.status === "pending" && (
                        <IconBtn
                          title="Confirm booking"
                          variant="green"
                          disabled={busyId === b.id}
                          onClick={() => updateStatus(b.id, "confirmed")}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </IconBtn>
                      )}

                      {/* Mark paid */}
                      {b.status !== "paid" && b.status !== "cancelled" && (
                        <IconBtn
                          title="Mark as paid"
                          variant="blue"
                          disabled={busyId === b.id}
                          onClick={() => updateStatus(b.id, "paid")}
                        >
                          <DollarSign className="h-3.5 w-3.5" />
                        </IconBtn>
                      )}

                      {/* Complete */}
                      {b.status === "confirmed" && (
                        <IconBtn
                          title="Mark complete"
                          variant="slate"
                          disabled={busyId === b.id}
                          onClick={() => updateStatus(b.id, "completed")}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </IconBtn>
                      )}

                      {/* Cancel */}
                      {b.status !== "cancelled" && b.status !== "completed" && (
                        <IconBtn
                          title="Cancel booking"
                          variant="amber"
                          disabled={busyId === b.id}
                          onClick={() => updateStatus(b.id, "cancelled")}
                        >
                          <Ban className="h-3.5 w-3.5" />
                        </IconBtn>
                      )}

                      {/* Delete */}
                      <IconBtn
                        title="Delete permanently"
                        variant="red"
                        disabled={busyId === b.id}
                        onClick={() => deleteBooking(b.id)}
                      >
                        {busyId === b.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <BookingModal
          booking={selected}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  variant = "slate",
  disabled,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  variant?: "slate" | "green" | "blue" | "amber" | "red";
  disabled?: boolean;
}) {
  const colors: Record<string, string> = {
    slate: "hover:bg-slate-900 hover:text-white",
    green: "hover:bg-emerald-600 hover:text-white",
    blue: "hover:bg-blue-600 hover:text-white",
    amber: "hover:bg-amber-500 hover:text-slate-900",
    red: "hover:bg-red-600 hover:text-white",
  };
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition disabled:opacity-40 ${colors[variant]}`}
    >
      {children}
    </button>
  );
}
