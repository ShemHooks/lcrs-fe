"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Loader2,
  RefreshCcw,
  RotateCcw,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useReviewerDashboardStats } from "@/server/hooks/dashboardHooks";

export default function ReviewerDashboardPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useReviewerDashboardStats();

  if (isLoading) {
    return <ReviewerDashboardLoading />;
  }

  if (isError) {
    return (
      <ReviewerDashboardError
        message={
          error instanceof Error
            ? error.message
            : "Unable to load reviewer dashboard."
        }
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  const dashboard = data?.dashboard;

  const stats = [
    {
      title: "Pending Review",
      value: dashboard?.pendingReview ?? 0,
      description: "Jobs waiting for review",
      icon: Clock3,
      valueClassName: "text-amber-600",
    },
    {
      title: "Reviewed Today",
      value: dashboard?.reviewedToday ?? 0,
      description: "Completed today",
      icon: ClipboardCheck,
      valueClassName: "text-blue-600",
    },
    {
      title: "Returned",
      value: dashboard?.returnedToday ?? 0,
      description: "Returned today",
      icon: RotateCcw,
      valueClassName: "text-red-600",
    },
    {
      title: "Approved",
      value: dashboard?.approvedThisWeek ?? 0,
      description: "Approved this week",
      icon: CheckCircle2,
      valueClassName: "text-emerald-600",
    },
  ];

  const pendingJobs = dashboard?.pendingJobs ?? [];
  const recentActivity = dashboard?.recentActivity ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92191d]">
            Civil Registry Review
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Reviewer Dashboard
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Review submitted civil registry applications, return records that
            need correction, and approve verified registrations.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isFetching}
            onClick={() => refetch()}
          >
            {isFetching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>

          <Button
            asChild
            className="bg-[#92191d] text-white hover:bg-[#761216]"
          >
            <Link href="/reviewer/jobs">
              <FileCheck2 className="mr-2 h-4 w-4" />
              View Review Jobs
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="rounded-xl border border-slate-200 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <p
                    className={`mt-2 text-3xl font-bold ${stat.valueClassName}`}
                  >
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {stat.description}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
                  <Icon className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        {/* Pending Jobs */}
        <Card className="overflow-hidden rounded-xl border border-slate-200">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Jobs Requiring Attention
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Submitted registrations waiting for review.
              </p>
            </div>

            <Button asChild size="sm" variant="outline">
              <Link href="/reviewer/jobs">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {pendingJobs.length === 0 ? (
            <div className="p-10 text-center">
              <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-400" />

              <p className="mt-3 font-medium text-slate-700">
                No pending review jobs
              </p>

              <p className="mt-1 text-sm text-slate-400">
                All submitted registrations have been reviewed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Type</th>

                    <th className="px-5 py-3">Registrant</th>

                    <th className="px-5 py-3">Submitted By</th>

                    <th className="px-5 py-3">Submitted</th>

                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {pendingJobs.map((job) => {
                    const submittedBy = [
                      job.clerk?.first_name,
                      job.clerk?.middle_name,
                      job.clerk?.last_name,
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <tr key={job.id} className="transition hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <RecordTypeBadge type={job.transaction_purpose} />
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-900">
                          {job.registrantName ||
                            "Registrant information unavailable"}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {submittedBy || "Unknown clerk"}
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {formatDateTime(job.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Button
                            asChild
                            size="sm"
                            className="bg-[#92191d] text-white hover:bg-[#761216]"
                          >
                            <Link href={`/reviewer/jobs/${job.id}`}>
                              Review
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Queue */}
          <Card className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">Review Queue</h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Current registrations waiting for reviewer action.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <QueueItem
                label="Pending Birth Records"
                value={dashboard?.queue?.birth ?? 0}
              />

              <QueueItem
                label="Pending Marriages"
                value={dashboard?.queue?.marriage ?? 0}
              />

              <QueueItem
                label="Pending Death Records"
                value={dashboard?.queue?.death ?? 0}
              />

              <QueueItem
                label="Resubmitted Records"
                value={dashboard?.queue?.resubmitted ?? 0}
              />
            </div>
          </Card>

          {/* Today's Summary */}
          <Card className="rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900">
              Today&apos;s Review Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review actions completed today.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <MiniStat
                label="Reviewed"
                value={dashboard?.reviewedToday ?? 0}
              />

              <MiniStat
                label="Returned"
                value={dashboard?.returnedToday ?? 0}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="rounded-xl border border-slate-200">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Recent Review Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest approval and return actions.
          </p>
        </div>

        {recentActivity.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardCheck className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 font-medium text-slate-700">
              No recent review activity
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Approved and returned jobs will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <ActivityIcon action={activity.status} />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {activity.status} · {activity.transaction_purpose}{" "}
                      Registration
                    </p>

                    {activity.reviewComment && (
                      <p className="mt-1 text-sm text-slate-500">
                        {activity.reviewComment}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  {formatDateTime(activity.reviewedAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function QueueItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-600">{label}</span>

      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function RecordTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    Birth: "bg-blue-50 text-blue-700",
    Marriage: "bg-pink-50 text-pink-700",
    Death: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[type] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {type}
    </span>
  );
}

function ActivityIcon({ action }: { action: string }) {
  const approved = action.toLowerCase() === "approved";

  return (
    <div
      className={
        approved
          ? "flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50"
          : "flex h-9 w-9 items-center justify-center rounded-full bg-red-50"
      }
    >
      {approved ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      ) : (
        <RotateCcw className="h-4 w-4 text-red-600" />
      )}
    </div>
  );
}

function ReviewerDashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

        <div className="mt-3 h-8 w-64 animate-pulse rounded bg-slate-200" />

        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <Card key={index} className="h-32 animate-pulse bg-slate-50" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="h-[380px] animate-pulse bg-slate-50" />

        <Card className="h-[380px] animate-pulse bg-slate-50" />
      </div>
    </div>
  );
}

function ReviewerDashboardError({
  message,
  onRetry,
  isRetrying,
}: {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
}) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="w-full max-w-lg p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-red-50 p-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-slate-900">
              Unable to load reviewer dashboard
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              disabled={isRetrying}
              onClick={onRetry}
            >
              {isRetrying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function formatDateTime(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
