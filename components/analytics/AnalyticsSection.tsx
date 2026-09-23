interface AnalyticsSectionProps {
  title: string;
  description?: string;
  /** Optional HTML anchor id (e.g. "reports" for the sidebar nav link). */
  id?: string;
  children: React.ReactNode;
}

export default function AnalyticsSection({
  title,
  description,
  id,
  children,
}: AnalyticsSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

        {description && (
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {children}
    </section>
  );
}
