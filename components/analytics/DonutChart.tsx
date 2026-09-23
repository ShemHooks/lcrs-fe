"use client";

import { useState } from "react";

interface DonutChartProps {
  title: string;
  description?: string;
  segments: {
    label: string;
    value: number;
    color: string;
  }[];
  centerLabel?: string;
}

/**
 * Donut chart built with SVG stroke-dasharray — no chart library needed.
 * Shows a center total, legend and per-segment tooltips.
 */
export default function DonutChart({
  title,
  description,
  segments,
  centerLabel = "Total",
}: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  const [active, setActive] = useState<string | null>(null);

  const radius = 60;

  const circumference = 2 * Math.PI * radius;

  // Precompute arc geometry (dash length + rotation offset) without mutating
  // anything during render. SVG circle strokes start at 3 o'clock; the
  // rotate(-90) below starts the first segment at noon.
  const arcs = segments.map((segment, index) => {
    const dash = total > 0 ? (segment.value / total) * circumference : 0;

    const offset = segments
      .slice(0, index)
      .reduce((sum, s) => sum + (total > 0 ? (s.value / total) * circumference : 0), 0);

    return { ...segment, dash, offset };
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>

        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {total === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-slate-400">No data available.</p>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-6">
          <svg
            viewBox="0 0 160 160"
            className="h-40 w-40 shrink-0"
            role="img"
            aria-label={title}
          >
            <g transform="rotate(-90 80 80)">
              {arcs.map((arc) => {
                if (arc.value <= 0) return null;

                const fraction = total > 0 ? arc.value / total : 0;

                const dash = arc.dash;

                const gap = circumference - dash;

                const offset = arc.offset;

                const isActive = active === arc.label;

                return (
                  <circle
                    key={arc.label}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke={arc.color}
                    strokeWidth={isActive ? 30 : 24}
                    strokeDasharray={`${dash} ${gap}`}
                    strokeDashoffset={-offset}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setActive(arc.label)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <title>{`${arc.label}: ${arc.value} (${Math.round(fraction * 100)}%)`}</title>
                  </circle>
                );
              })}
            </g>

            <text
              x="80"
              y="76"
              textAnchor="middle"
              className="fill-slate-900"
              fontSize="22"
              fontWeight="700"
            >
              {active
                ? segments.find((s) => s.label === active)?.value
                : total}
            </text>

            <text
              x="80"
              y="94"
              textAnchor="middle"
              className="fill-slate-400"
              fontSize="10"
            >
              {active ?? centerLabel}
            </text>
          </svg>

          <div className="min-w-0 flex-1 space-y-2">
            {segments.map((segment) => (
              <button
                key={segment.label}
                type="button"
                onMouseEnter={() => setActive(segment.label)}
                onMouseLeave={() => setActive(null)}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-left text-sm transition ${
                  active === segment.label ? "bg-slate-50" : ""
                }`}
              >
                <span className="flex items-center gap-2 text-slate-600">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />

                  {segment.label}
                </span>

                <span className="font-semibold text-slate-900">
                  {segment.value}
                  <span className="ml-1.5 text-xs font-normal text-slate-400">
                    {total > 0
                      ? `${Math.round((segment.value / total) * 100)}%`
                      : "0%"}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
