"use client";

import { useState } from "react";

import AnalyticsShell from "@/components/analytics/AnalyticsShell";
import ReportsPanel from "@/components/analytics/ReportsPanel";

export default function ReviewerReportsPage() {
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <AnalyticsShell
      eyebrow="Civil Registry Review"
      title="Reports"
      description="Generated breakdowns, searches and record-linkage flags for registration records."
      year={year}
      onYearChange={setYear}
      isLoading={false}
      isFetching={false}
      isError={false}
      error={null}
      onRetry={() => {}}
    >
      <ReportsPanel year={year} />
    </AnalyticsShell>
  );
}
