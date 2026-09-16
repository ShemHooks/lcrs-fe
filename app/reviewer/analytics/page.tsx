"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Heart,
  RotateCcw,
  Skull,
  Timer,
} from "lucide-react";

import StatCard from "@/components/analytics/StatCard";
import BarList from "@/components/analytics/BarList";
import AnalyticsSection from "@/components/analytics/AnalyticsSection";
import AnalyticsShell from "@/components/analytics/AnalyticsShell";

import {
  useReviewerAnalytics,
  useSharedAnalytics,
} from "@/server/hooks/analyticsHooks";

const formatDuration = (minutes: number | null) => {
  if (minutes == null) return "—";

  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainder = Math.round(minutes % 60);

  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
};

export default function ReviewerAnalyticsPage() {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data, isLoading, isError, error, refetch, isFetching } =
    useReviewerAnalytics(year);

  const {
    data: shared,
    isLoading: sharedLoading,
    isError: sharedError,
    error: sharedErrorObj,
    refetch: sharedRefetch,
    isFetching: sharedFetching,
  } = useSharedAnalytics(year);

  return (
    <AnalyticsShell
      eyebrow="Civil Registry Review"
      title="Review Analytics"
      description="Your review performance and shared registration statistics."
      year={year}
      onYearChange={setYear}
      isLoading={isLoading || sharedLoading}
      isFetching={isFetching || sharedFetching}
      isError={isError || sharedError}
      error={isError ? error : sharedErrorObj}
      onRetry={() => {
        refetch();
        sharedRefetch();
      }}
    >
      {data && shared && (
        <>
          <AnalyticsSection
            title="Review Performance"
            description="Your review activity for the selected year."
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Records Reviewed"
                value={data.reviewed}
                description="Approved + returned"
                icon={<ClipboardCheck className="h-5 w-5 text-blue-600" />}
                valueClassName="text-blue-600"
              />

              <StatCard
                title="Pending Review"
                value={data.pendingReview}
                description="Waiting in queue"
                icon={<Clock3 className="h-5 w-5 text-amber-600" />}
                valueClassName="text-amber-600"
              />

              <StatCard
                title="Approval Rate"
                value={
                  data.approvalRate != null ? `${data.approvalRate}%` : "—"
                }
                description={`${data.approved} approved`}
                icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                valueClassName="text-emerald-600"
              />

              <StatCard
                title="Return Rate"
                value={data.returnRate != null ? `${data.returnRate}%` : "—"}
                description={`${data.returned} returned`}
                icon={<RotateCcw className="h-5 w-5 text-red-600" />}
                valueClassName="text-red-600"
              />
            </div>
          </AnalyticsSection>

          <AnalyticsSection
            title="Efficiency"
            description="How quickly reviews are completed."
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Avg Review Time"
                value={formatDuration(data.averageReviewMinutes)}
                description="From submission to decision"
                icon={<Timer className="h-5 w-5 text-slate-600" />}
              />

              <StatCard
                title="Approved"
                value={data.approved}
                description="Total this year"
                icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              />

              <StatCard
                title="Returned"
                value={data.returned}
                description="Total this year"
                icon={<RotateCcw className="h-5 w-5 text-red-600" />}
              />

              <StatCard
                title="Pending Review"
                value={data.pendingReview}
                description="In the queue right now"
                icon={<Clock3 className="h-5 w-5 text-amber-600" />}
              />
            </div>
          </AnalyticsSection>

          <AnalyticsSection
            title="Vital Statistics"
            description="Registration breakdowns shared across all roles."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                title="Total Births"
                value={shared.births.total}
                description={`Male: ${shared.births.byGender.Male} | Female: ${shared.births.byGender.Female}`}
                icon={<FileText className="h-5 w-5 text-blue-600" />}
              />

              <StatCard
                title="Total Marriages"
                value={shared.marriages.total}
                description="Registered this year"
                icon={<Heart className="h-5 w-5 text-pink-600" />}
              />

              <StatCard
                title="Total Deaths"
                value={shared.deaths.total}
                description="Registered this year"
                icon={<Skull className="h-5 w-5 text-slate-600" />}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <BarList
                title="Births by Gender"
                description={`${shared.births.total} total births`}
                items={[
                  {
                    label: "Male",
                    count: shared.births.byGender.Male,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Female",
                    count: shared.births.byGender.Female,
                    color: "bg-pink-500",
                  },
                  {
                    label: "Unknown",
                    count: shared.births.byGender.Unknown,
                    color: "bg-slate-400",
                  },
                ]}
              />

              <BarList
                title="Marriages by Age Range"
                description="Grooms and brides combined"
                items={shared.marriages.byAgeRange.map((bucket) => ({
                  label: bucket.label,
                  count: bucket.count,
                  color: "bg-pink-500",
                }))}
              />

              <BarList
                title="Deaths by Age Range"
                description={`${shared.deaths.total} total deaths`}
                items={shared.deaths.byAgeRange.map((bucket) => ({
                  label: bucket.label,
                  count: bucket.count,
                  color: "bg-slate-500",
                }))}
              />
            </div>
          </AnalyticsSection>
        </>
      )}
    </AnalyticsShell>
  );
}
