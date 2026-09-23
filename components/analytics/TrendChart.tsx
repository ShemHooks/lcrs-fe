"use client";

import { useMemo, useState } from "react";

type Series = {
  label: string;
  color: string;
  /** For monthly cadence: 12 parallel values (Jan-Dec). */
  values?: number[];
  /** For weekly cadence: sparse points keyed by week (or generic key). */
  points?: { key?: string; week?: string; count: number }[];
};

interface TrendChartProps {
  title: string;
  description?: string;
  /** "month" renders a fixed Jan-Dec axis; "week" renders the sparse week axis. */
  cadence: "month" | "week";
  /** Month keys (YYYY-MM) or week keys (YYYY-Www) that exist in the data. */
  keys: string[];
  series: Series[];
  /** Default granularity used for the initial render. */
  defaultGranularity?: "month" | "week";
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const shortKeyLabel = (key: string, cadence: "month" | "week") => {
  if (cadence === "month") {
    const monthIndex = Number(key.slice(5, 7)) - 1;
    return MONTH_LABELS[monthIndex] ?? key;
  }

  return key.replace(/^\d{4}-W/, "W");
};

const toPoints = (series: Series, cadence: "month" | "week", keys: string[]) => {
  if (cadence === "week") {
    const byKey = new Map(
      (series.points ?? []).map((point) => [
        point.key ?? point.week ?? "",
        point.count,
      ]),
    );
    return keys.map((key) => byKey.get(key) ?? 0);
  }

  return keys.map(
    (_, index) => series.values?.[index] ?? 0,
  );
};

/**
 * Multi-line trend chart built with an inline SVG — no chart library needed.
 * Shows one line per series with hover tooltips. For monthly cadence the
 * x-axis is the fixed Jan-Dec grid; for weekly cadence it is the sparse list
 * of ISO weeks that actually had registrations.
 */
export default function TrendChart({
  title,
  description,
  cadence,
  keys,
  series,
  defaultGranularity,
}: TrendChartProps) {
  const [granularity, setGranularity] = useState<"month" | "week">(
    defaultGranularity ?? cadence,
  );

  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  const monthKeys = useMemo(
    () => Array.from({ length: 12 }, (_, i) => `0000-${String(i + 1).padStart(2, "0")}`),
    [],
  );

  const activeCadence = granularity === "week" ? "week" : "month";

  const activeKeys = activeCadence === "week" ? keys : monthKeys;

  const activeSeries = series.map((s) => ({
    ...s,
    activeValues: toPoints(s, activeCadence, activeKeys),
  }));

  const visibleSeries = activeSeries.filter((s) => !hidden[s.label]);

  const max = Math.max(...visibleSeries.flatMap((s) => s.activeValues), 1);

  const width = 560;

  const height = 200;

  const padding = { top: 10, right: 12, bottom: 22, left: 30 };

  const plotWidth = width - padding.left - padding.right;

  const plotHeight = height - padding.top - padding.bottom;

  const x = (index: number) =>
    padding.left +
    (activeKeys.length <= 1
      ? plotWidth / 2
      : (index / (activeKeys.length - 1)) * plotWidth);

  const y = (value: number) =>
    padding.top + plotHeight - (value / max) * plotHeight;

  const niceMax = (value: number) => {
    if (value <= 5) return 5;
    const step = value <= 10 ? 2 : 10;
    return Math.ceil(value / step) * step;
  };

  const axisMax = niceMax(max);

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  const labelEvery = activeKeys.length > 26 ? 5 : activeKeys.length > 12 ? 3 : 1;

  const hasWeekData =
    cadence === "week" && series.some((s) => (s.points ?? []).length > 0);

  const showToggle = cadence === "week" && hasWeekData;

  const toggle = showToggle && (
    <div className="flex overflow-hidden rounded-md border border-slate-200 text-xs">
      {(["month", "week"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setGranularity(option)}
          className={`px-3 py-1 transition ${
            granularity === option
              ? "bg-[#92191d] text-white"
              : "bg-white text-slate-500 hover:bg-slate-50"
          }`}
        >
          {option === "month" ? "Monthly" : "Weekly"}
        </button>
      ))}
    </div>
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>

          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>

        {toggle}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {series.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() =>
              setHidden((current) => ({ ...current, [s.label]: !current[s.label] }))
            }
            className={`flex items-center gap-1.5 text-xs transition ${
              hidden[s.label] ? "opacity-40" : ""
            } hover:opacity-75`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />

            <span className="text-slate-600">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-52 w-full min-w-[480px]"
          role="img"
          aria-label={title}
        >
          {/* Horizontal grid lines + y labels */}
          {gridLines.map((line) => {
            const lineY = padding.top + plotHeight * line;

            return (
              <g key={line}>
                <line
                  x1={padding.left}
                  x2={width - padding.right}
                  y1={lineY}
                  y2={lineY}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />

                <text
                  x={padding.left - 6}
                  y={lineY + 3}
                  textAnchor="end"
                  className="fill-slate-400"
                  fontSize="9"
                >
                  {Math.round(axisMax * (1 - line))}
                </text>
              </g>
            );
          })}

          {/* Series lines + points */}
          {activeSeries.map((s) => {
            if (hidden[s.label]) return null;

            const points = s.activeValues
              .map((value, index) => ({ value, index }))
              .filter((p) => p.value > 0 || activeKeys.length <= 12);

            const path = s.activeValues
              .map(
                (value, index) =>
                  `${index === 0 ? "M" : "L"} ${x(index)} ${y(value)}`,
              )
              .join(" ");

            return (
              <g key={s.label}>
                <path
                  d={path}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {points.map((p) => (
                  <g key={p.index}>
                    <circle
                      cx={x(p.index)}
                      cy={y(p.value)}
                      r="6"
                      fill="transparent"
                    >
                      <title>{`${shortKeyLabel(activeKeys[p.index], activeCadence)}: ${s.label} ${p.value}`}</title>
                    </circle>

                    <circle
                      cx={x(p.index)}
                      cy={y(p.value)}
                      r="2.5"
                      fill={s.color}
                    />
                  </g>
                ))}
              </g>
            );
          })}

          {/* X axis labels (index-suffixed key guards against duplicate keys) */}
          {activeKeys.map((key, index) =>
            index % labelEvery === 0 || index === activeKeys.length - 1 ? (
              <text
                key={`${key}-${index}`}
                x={x(index)}
                y={height - 6}
                textAnchor="middle"
                className="fill-slate-400"
                fontSize="9"
              >
                {shortKeyLabel(key, activeCadence)}
              </text>
            ) : null,
          )}
        </svg>
      </div>
    </div>
  );
}
