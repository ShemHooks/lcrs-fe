"use client";

import { useState } from "react";
import {
  Baby,
  CheckCircle2,
  Clock3,
  FileText,
  Heart,
  RotateCcw,
  Send,
  CheckCheck,
  Skull,
} from "lucide-react";

import StatCard from "@/components/analytics/StatCard";
import BarList from "@/components/analytics/BarList";
import AnalyticsSection from "@/components/analytics/AnalyticsSection";
import AnalyticsShell from "@/components/analytics/AnalyticsShell";

import { useClerkAnalytics, useSharedAnalytics } from "@/server/hooks/analyticsHooks";

export default function ClerkAnalyticsPage() {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data, isLoading, isError, error, refetch, isFetching } =
    useClerkAnalytics(year);

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
      eyebrow="Local Civil Registry"
      title="My Analytics"
      description="Your submission activity and the registrations you have handled."
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
            title="My Submissions"
            description="Transactions you submitted for the selected year."
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <StatCard
                title="Submitted"
                value={data.submitted}
                description="Total this year"
                icon={<Send className="h-5 w-5 text-slate-600" />}
              />

              <StatCard
                title="Pending"
                value={data.pending}
                description="Awaiting review"
                icon={<Clock3 className="h-5 w-5 text-amber-600" />}
                valueClassName="text-amber-600"
              />

              <StatCard
                title="Returned"
                value={data.returned}
                description="Needs correction"
                icon={<RotateCcw className="h-5 w-5 text-red-600" />}
                valueClassName="text-red-600"
              />

              <StatCard
                title="Approved"
                value={data.approved}
                description="Passed review"
                icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                valueClassName="text-emerald-600"
              />

              <StatCard
                title="Completed"
                value={data.completed}
                description="Fully processed"
                icon={<CheckCheck className="h-5 w-5 text-blue-600" />}
                valueClassName="text-blue-600"
              />
            </div>
          </AnalyticsSection>

          <AnalyticsSection
            title="Registrations by Type"
            description="Your submitted registrations grouped by record type."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <BarList
                title="By Record Type"
                description={`${data.submitted} total submissions`}
                items={[
                  {
                    label: "Birth",
                    count: data.byPurpose.Birth ?? 0,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Marriage",
                    count: data.byPurpose.Marriage ?? 0,
                    color: "bg-pink-500",
                  },
                  {
                    label: "Death",
                    count: data.byPurpose.Death ?? 0,
                    color: "bg-slate-500",
                  },
                ]}
              />

              <BarList
                title="By Status"
                description="Current workflow state of your submissions"
                items={Object.entries(data.byStatus).map(([label, count]) => ({
                  label,
                  count,
                  color:
                    label === "Approved"
                      ? "bg-emerald-500"
                      : label === "Returned"
                        ? "bg-red-500"
                        : label === "Completed"
                          ? "bg-blue-500"
                          : "bg-amber-500",
                }))}
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
