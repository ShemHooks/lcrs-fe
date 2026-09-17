"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useClerkJobs } from "@/server/hooks/jobsHooks";

type JobStatus = "Pending" | "Returned" | "Approved";
type RecordType = "All" | "Birth" | "Marriage" | "Death";

export default function ClerkJobsPage() {
  const [status, setStatus] = useState<"All" | JobStatus>("All");
  const [recordType, setRecordType] = useState<RecordType>("All");
  const [search, setSearch] = useState("");

  // Only record type is sent to the backend here.
  // We keep all statuses loaded so the summary cards can
  // always show correct counts.
  const apiFilters = useMemo(
    () => ({
      type: recordType === "All" ? undefined : recordType,
    }),
    [recordType],
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    useClerkJobs(apiFilters);

  const allJobs = data?.data ?? [];

  // Summary counts from all currently loaded clerk jobs.
  const count = useMemo(() => {
    return {
      pending: allJobs.filter((job) => job.status === "Pending").length,

      returned: allJobs.filter((job) => job.status === "Returned").length,

      approved: allJobs.filter((job) => job.status === "Approved").length,

      overall: allJobs.length,
    };
  }, [allJobs]);

  // Status + keyword filtering.
  const jobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allJobs.filter((job) => {
      const matchesStatus = status === "All" || job.status === status;

      const matchesSearch =
        !query ||
        job.subjectName?.toLowerCase().includes(query) ||
        job.registryNumber?.toLowerCase().includes(query) ||
        job.type?.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [allJobs, status, search]);

  if (isLoading) {
    return <JobsLoading />;
  }

  if (isError) {
    return (
      <JobsError
        message={
          error instanceof Error ? error.message : "Unable to load your jobs."
        }
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92191d]">
          Civil Registry Transactions
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          My Jobs
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Track your submitted registrations, reviewer feedback, and completed
          transactions.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Submitted"
          value={count.pending}
          description="Waiting for review"
          icon={Clock3}
          className="text-amber-600"
        />

        <SummaryCard
          title="Returned"
          value={count.returned}
          description="Needs correction"
          icon={RotateCcw}
          className="text-red-600"
        />

        <SummaryCard
          title="Approved"
          value={count.approved}
          description="Completed registrations"
          icon={CheckCircle2}
          className="text-emerald-600"
        />
      </div>

      {/* Filters */}
      <Card className="rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-[#92191d]" />

            <h2 className="font-semibold text-slate-900">Filter My Jobs</h2>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
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
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by registrant or registry number"
              className="pl-10"
            />
          </div>

          {/* Record Type */}
          <select
            value={recordType}
            onChange={(event) =>
              setRecordType(event.target.value as RecordType)
            }
            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none"
          >
            <option value="All">All Record Types</option>

            <option value="Birth">Birth</option>

            <option value="Marriage">Marriage</option>

            <option value="Death">Death</option>
          </select>
        </div>

        {/* Status Tabs */}
        <div className="mt-5 flex flex-wrap gap-2">
          {(["All", "Pending", "Returned", "Approved"] as const).map((item) => {
            const label = item === "Pending" ? "Submitted" : item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={
                  status === item
                    ? "rounded-md bg-[#92191d] px-4 py-2 text-sm font-medium text-white"
                    : "rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Jobs */}
      <Card className="overflow-hidden rounded-xl border border-slate-200">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              {getSectionTitle(status)}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
            </p>
          </div>

          {isFetching && (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          )}
        </div>

        {jobs.length === 0 ? (
          <EmptyJobs status={status} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Type</th>

                  <th className="px-5 py-3">Record Subject</th>

                  <th className="px-5 py-3">Registry No.</th>

                  <th className="px-5 py-3">Submitted</th>

                  <th className="px-5 py-3">Status</th>

                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {jobs.map((job) => (
                  <tr key={job.id} className="transition hover:bg-slate-50">
                    {/* Type */}
                    <td className="px-5 py-4">
                      <RecordTypeBadge type={job.type} />
                    </td>

                    {/* Subject */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {job.subjectName || "Unknown subject"}
                      </p>

                      {job.status === "Returned" && job.reviewComment && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
                          <RotateCcw className="h-3 w-3 shrink-0" />

                          <span className="max-w-[350px] truncate">
                            {job.reviewComment}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Registry Number */}
                    <td className="px-5 py-4 text-slate-600">
                      {job.registryNumber || "—"}
                    </td>

                    {/* Submitted */}
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {formatDateTime(job.submittedAt)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={job.status} />
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      {job.status === "Returned" ? (
                        <Button
                          asChild
                          size="sm"
                          className="bg-[#92191d] text-white hover:bg-[#761216]"
                        >
                          <Link href={`/clerk/jobs/${job.certificateId}`}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Correct
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/clerk/jobs/${job.certificateId}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  className,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  className: string;
}) {
  return (
    <Card className="rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className={`mt-2 text-3xl font-bold ${className}`}>{value}</p>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
          <Icon className="h-5 w-5 text-slate-600" />
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// RECORD TYPE
// ============================================================

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

// ============================================================
// STATUS
// ============================================================

function StatusBadge({ status }: { status: JobStatus }) {
  const config: Record<
    JobStatus,
    {
      label: string;
      className: string;
    }
  > = {
    Pending: {
      label: "Submitted",
      className: "bg-amber-50 text-amber-700",
    },

    Returned: {
      label: "Returned",
      className: "bg-red-50 text-red-700",
    },

    Approved: {
      label: "Approved",
      className: "bg-emerald-50 text-emerald-700",
    },
  };

  const item = config[status];

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}

// ============================================================
// SECTION TITLE
// ============================================================

function getSectionTitle(status: "All" | JobStatus) {
  switch (status) {
    case "Pending":
      return "Submitted Jobs";

    case "Returned":
      return "Returned Jobs";

    case "Approved":
      return "Approved Jobs";

    default:
      return "All My Jobs";
  }
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyJobs({ status }: { status: "All" | JobStatus }) {
  return (
    <div className="p-12 text-center">
      <FileText className="mx-auto h-9 w-9 text-slate-300" />

      <p className="mt-3 font-medium text-slate-700">
        {status === "Returned"
          ? "No returned jobs"
          : status === "Pending"
            ? "No submitted jobs"
            : status === "Approved"
              ? "No approved jobs"
              : "No jobs found"}
      </p>

      <p className="mt-1 text-sm text-slate-400">
        {status === "Returned"
          ? "You currently have no registrations requiring correction."
          : "Try changing the selected filters."}
      </p>
    </div>
  );
}

// ============================================================
// DATE
// ============================================================

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ============================================================
// LOADING
// ============================================================

function JobsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

        <div className="mt-3 h-8 w-64 animate-pulse rounded bg-slate-200" />

        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({
          length: 3,
        }).map((_, index) => (
          <Card key={index} className="h-32 animate-pulse bg-slate-50" />
        ))}
      </div>

      <Card className="h-[120px] animate-pulse bg-slate-50" />

      <Card className="h-[300px] animate-pulse bg-slate-50" />
    </div>
  );
}

// ============================================================
// ERROR
// ============================================================

function JobsError({
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
              Unable to load your jobs
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
