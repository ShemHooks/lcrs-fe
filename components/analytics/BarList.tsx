interface BarListProps {
  title: string;
  description?: string;
  items: { label: string; count: number; color?: string }[];
  emptyMessage?: string;
}

/**
 * Horizontal bar list rendered with plain divs — no chart library needed.
 */
export default function BarList({
  title,
  description,
  items,
  emptyMessage = "No data available.",
}: BarListProps) {
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">{title}</h3>

      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}

      {items.length === 0 || items.every((i) => i.count === 0) ? (
        <div className="mt-4 rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-slate-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-slate-600">{item.label}</span>

                <span className="font-semibold text-slate-900">
                  {item.count}
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${item.color ?? "bg-[#92191d]"}`}
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
