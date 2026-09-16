import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  valueClassName?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  valueClassName,
}: StatCardProps) {
  return (
    <Card className="rounded-xl border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>

            <p className={`mt-2 text-3xl font-bold ${valueClassName ?? ""}`}>
              {value}
            </p>

            {description && (
              <p className="mt-1 text-xs text-slate-400">{description}</p>
            )}
          </div>

          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
