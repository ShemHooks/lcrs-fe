"use client";

import { LucideIcon, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  valueClassName?: string;
}

export default function DashboardCard({
  title,
  value,
  description,
  icon,
  action,
  valueClassName,
}: DashboardCardProps) {
  return (
    <Card className="shadow-xl border-0 ">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            {icon}
            <p className={`text-4xl font-bold ${valueClassName}`}>{value}</p>
          </div>

          <div>{action}</div>
        </div>

        <div className="mt-6">
          <h3 className="text-muted-foreground text-lg">{title}</h3>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
