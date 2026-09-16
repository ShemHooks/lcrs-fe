interface AnalyticsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function AnalyticsSection({
  title,
  description,
  children,
}: AnalyticsSectionProps) {
  return (
    <section className="space-y-4">
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
