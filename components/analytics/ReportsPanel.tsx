"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import AnalyticsSection from "@/components/analytics/AnalyticsSection";
import ReportsSection from "@/components/analytics/ReportsSection";

import {
  useNationalitySearch,
  useReportsBundle,
} from "@/server/hooks/analyticsHooks";

interface ReportsPanelProps {
  year?: number;
}

/**
 * Self-contained Reports sidebar panel: fetches the reports bundle and
 * owns the nationality search state. Rendered by the role analytics pages
 * (admin / clerk / reviewer) as the target of the "Reports" nav entry
 * (`#reports` anchor).
 */
export default function ReportsPanel({ year }: ReportsPanelProps) {
  const [nationalityQuery, setNationalityQuery] = useState("");

  const { data: reports, isLoading } = useReportsBundle(year);

  const { isFetching: nationalitySearching, data: nationalityResults } =
    useNationalitySearch(nationalityQuery, year);

  return (
    <AnalyticsSection
      id="reports"
      title="Reports"
      description="Generated breakdowns, searches and record-linkage flags."
    >
      {isLoading || !reports ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-48 animate-pulse bg-slate-50" />
          ))}
        </div>
      ) : (
        <ReportsSection
          reports={reports}
          nationalitySearch={{
            query: nationalityQuery,
            onQueryChange: setNationalityQuery,
            isSearching: nationalitySearching,
            data: nationalityResults,
          }}
        />
      )}
    </AnalyticsSection>
  );
}
