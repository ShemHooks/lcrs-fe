"use client";

import { useState } from "react";
import {
  Baby,
  Clock3,
  FileText,
  FolderLock,
  Heart,
  Skull,
  Users,
} from "lucide-react";

import StatCard from "@/components/analytics/StatCard";
import BarList from "@/components/analytics/BarList";
import AnalyticsSection from "@/components/analytics/AnalyticsSection";
import MonthlyVolumeChart from "@/components/analytics/MonthlyVolumeChart";
import AnalyticsShell from "@/components/analytics/AnalyticsShell";

import { useAdminAnalytics, useSharedAnalytics } from "@/server/hooks/analyticsHooks";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-amber-500",
  Approved: "bg-emerald-500",
  Returned: "bg-red-500",
  Completed: "bg-blue-500",
};

export default function AdminAnalyticsPage() {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminAnalytics(year);

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
      title="Analytics"
      description="System-wide statistics across users, registrations and processing volume."
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
          {/* Users + registrations overview */}
          <AnalyticsSection
            title="Overview"
            description="Users and registration records for the selected year."
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Users"
                value={data.users.total}
                description={`Active: ${data.users.active} | Inactive: ${data.users.inactive}`}
                icon={<Users className="h-5 w-5 text-slate-600" />}
              />

              <StatCard
                title="Birth Registrations"
                value={data.registrations.births}
                description="Records created this year"
                icon={<Baby className="h-5 w-5 text-blue-600" />}
                valueClassName="text-blue-600"
              />

              <StatCard
                title="Marriage Registrations"
                value={data.registrations.marriages}
                description="Records created this year"
                icon={<Heart className="h-5 w-5 text-pink-600" />}
                valueClassName="text-pink-600"
              />

              <StatCard
                title="Death Registrations"
                value={data.registrations.deaths}
                description="Records created this year"
                icon={<Skull className="h-5 w-5 text-slate-600" />}
              />
            </div>
          </AnalyticsSection>

          {/* Transactions by status + processing volume */}
          <AnalyticsSection
            title="Processing"
            description="Workflow transactions and monthly system-wide volume."
          >
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.4fr]">
              <BarList
                title="Transactions by Status"
                description={`${data.transactions.total} total transactions this year`}
                items={Object.entries(data.transactions.byStatus).map(
                  ([label, count]) => ({
                    label,
                    count,
                    color: STATUS_COLORS[label] ?? "bg-slate-400",
                  }),
                )}
              />

              <MonthlyVolumeChart
                title="System-wide Processing Volume"
                description="Monthly registrations and transactions for the selected year."
                months={data.processingVolume.months}
                series={[
                  {
                    label: "Births",
                    color: "#2563eb",
                    values: data.processingVolume.births,
                  },
                  {
                    label: "Marriages",
                    color: "#db2777",
                    values: data.processingVolume.marriages,
                  },
                  {
                    label: "Deaths",
                    color: "#64748b",
                    values: data.processingVolume.deaths,
                  },
                  {
                    label: "Transactions",
                    color: "#16a34a",
                    values: data.processingVolume.transactions,
                  },
                ]}
              />
            </div>
          </AnalyticsSection>

          {/* Shared vital statistics */}
          <AnalyticsSection
            title="Vital Statistics"
            description="Registration breakdowns shared across all roles."
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                icon={<FolderLock className="h-5 w-5 text-slate-600" />}
              />

              <StatCard
                title="Pending Transactions"
                value={data.transactions.byStatus["Pending"] ?? 0}
                description="Waiting for review"
                icon={<Clock3 className="h-5 w-5 text-amber-600" />}
                valueClassName="text-amber-600"
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
