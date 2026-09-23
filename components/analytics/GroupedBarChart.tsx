interface GroupedBarChartProps {
  title: string;
  description?: string;
  /** One entry per x-axis bucket. */
  labels: string[];
  /** One series per role/segment, parallel to `labels`. */
  series: {
    label: string;
    color: string;
    values: number[];
  }[];
}

/**
 * Grouped vertical bar chart built with CSS flex — no chart library needed.
 * One bar group per label, one bar per series, tooltip on hover.
 */
export default function GroupedBarChart({
  title,
  description,
  labels,
  series,
}: GroupedBarChartProps) {
  const max = Math.max(...series.flatMap((s) => s.values), 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>

          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 text-xs">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />

              <span className="text-slate-600">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex h-56 items-end gap-2 overflow-x-auto pb-1">
        {labels.map((label, i) => (
          <div
            key={label}
            className="group flex min-w-[42px] flex-1 flex-col items-center gap-1"
            title={`${label}: ${series
              .map((s) => `${s.label} ${s.values[i] ?? 0}`)
              .join(", ")}`}
          >
            <div className="flex h-48 w-full items-end justify-center gap-0.5">
              {series.map((s) => {
                const value = s.values[i] ?? 0;
                const heightPct = (value / max) * 100;

                return (
                  <div
                    key={s.label}
                    className="relative w-full max-w-[14px] rounded-t transition-all"
                    style={{
                      height: value > 0 ? `${Math.max(heightPct, 2)}%` : "2px",
                      backgroundColor: s.color,
                      opacity: value > 0 ? 1 : 0.15,
                    }}
                  >
                    {value > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {value}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <span className="text-[10px] font-medium text-slate-400">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
