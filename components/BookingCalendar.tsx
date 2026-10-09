"use client";

import { useEffect, useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isBefore,
  startOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  bookedDates: string[];
  selected: Date | null;
  onSelect: (d: Date) => void;
};

export default function BookingCalendar({
  bookedDates,
  selected,
  onSelect,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [month, setMonth] = useState<Date | null>(null);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setMonth(new Date());
    setToday(startOfDay(new Date()));
  }, []);

  const days = useMemo(() => {
    if (!month) return [];
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const all = eachDayOfInterval({ start, end });
    const pad = start.getDay();
    return [...Array(pad).fill(null), ...all];
  }, [month]);

  const isBooked = (d: Date) =>
    bookedDates.some((b) => isSameDay(new Date(b), d));

  if (!mounted || !month || !today) {
    return (
      <div className="p-2">
        <div className="mb-4 h-10 animate-pulse rounded-2xl bg-ink/5" />
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 42 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-xl bg-ink/5"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonth(subMonths(month, 1))}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 text-ink transition hover:border-gold hover:text-gold"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="font-display text-lg text-ink">
          {format(month, "MMMM yyyy")}
        </div>
        <button
          type="button"
          onClick={() => setMonth(addMonths(month, 1))}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 text-ink transition hover:border-gold hover:text-gold"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          if (!d) return <div key={i} />;
          const past = isBefore(d, today);
          const booked = isBooked(d);
          const isSelected = selected && isSameDay(d, selected);
          const disabled = past || booked;

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(d)}
              className={`flex aspect-square items-center justify-center rounded-xl text-sm font-medium transition ${
                disabled
                  ? "cursor-not-allowed text-ink/20"
                  : "text-ink hover:bg-gold/15 hover:text-gold"
              } ${
                booked && !past
                  ? "bg-red-50 text-red-300 line-through hover:bg-red-50"
                  : ""
              } ${
                isSelected
                  ? "bg-gold text-ink shadow-md shadow-gold/30 hover:bg-gold"
                  : ""
              }`}
            >
              {format(d, "d")}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-5 border-t border-ink/10 pt-5 text-[10px] uppercase tracking-[0.18em] text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-gold" /> Selected
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-red-200" /> Booked
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-ink/10" /> Available
        </span>
      </div>
    </div>
  );
}
