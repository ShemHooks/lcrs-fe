"use client";

import { useMemo, useState } from "react";

interface SortableBarListProps {
  title: string;
  description?: string;
  items: { label: string; count: number }[];
  color?: string;
}

type SortDirection = "desc" | "asc";

/**
 * Horizontal bar list with a count sort toggle — used for the
 * birth-records-by-barangay distribution where the list can be long.
 */
export default function SortableBarList({
  title,
  description,
  items,
  color = "bg-[#92191d]",
}: SortableBarListProps) {
  const [direction, setDirection] = useState<SortDirection>("desc");

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) =>
        direction === "desc" ? b.count - a.count : a.count - b.count,
      ),
    [items, direction],
  );

  const max = Math.max(...items.map((i) => i.count), 1);

  const toggleDirection = () =>
    setDirection((current) => (current === "desc" ? "asc" : "desc"));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>

          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={toggleDirection}
          className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:border-[#92191d]/30 hover:bg-red-50 hover:text-[#92191d]"
        >
          Sort: {direction === "desc" ? "High to low" : "Low to high"}
        </button>
      </div>

      {items.length === 0 || items.every((i) => i.count === 0) ? (
        <div className="mt-4 rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-slate-400">No data available.</p>
        </div>
      ) : (
        <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
          {sorted.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="truncate text-slate-600" title={item.label}>
                  {item.label}
                </span>

                <span className="font-semibold text-slate-900">
                  {item.count}
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
