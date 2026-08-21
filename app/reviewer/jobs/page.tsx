"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  CheckCircle2,
  Clock3,
  Eye,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type JobStatus = "Pending" | "Returned" | "Approved";

type ReviewerJob = {
  id: string;
  type: "Birth" | "Marriage" | "Death";
  subjectName: string;
  submittedBy: string;
  submittedAt: string;
  status: JobStatus;
  reviewComment?: string;
};

const jobs: ReviewerJob[] = [
  {
    id: "1",
    type: "Birth",
    subjectName: "Juan Miguel Dela Cruz",
    submittedBy: "Shem Regidor",
    submittedAt: "2026-08-18T09:20:00",
    status: "Pending",
  },
  {
    id: "2",
    type: "Birth",
    subjectName: "Ana Marie Santos",
    submittedBy: "Shem Regidor",
    submittedAt: "2026-08-18T08:15:00",
    status: "Pending",
  },
  {
    id: "3",
    type: "Marriage",
    subjectName: "Carlos Reyes & Mae Villanueva",
    submittedBy: "Maria Lopez",
    submittedAt: "2026-08-17T15:30:00",
    status: "Approved",
  },
  {
    id: "4",
    type: "Death",
    subjectName: "Roberto Villanueva",
    submittedBy: "John Santos",
    submittedAt: "2026-08-17T13:10:00",
    status: "Returned",
    reviewComment: "Please verify the place of death.",
  },
];

export default function ReviewerJobsPage() {
  const [status, setStatus] = useState<"All" | JobStatus>("Pending");
  const [recordType, setRecordType] = useState<
    "All" | "Birth" | "Marriage" | "Death"
  >("All");

  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesStatus = status === "All" || job.status === status;

      const matchesType = recordType === "All" || job.type === recordType;

      const matchesSearch =
        !query ||
        job.subjectName.toLowerCase().includes(query) ||
        job.submittedBy.toLowerCase().includes(query);

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [status, recordType, search]);

  const pendingCount = jobs.filter((job) => job.status === "Pending").length;

  const returnedCount = jobs.filter((job) => job.status === "Returned").length;

  const approvedCount = jobs.filter((job) => job.status === "Approved").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92191d]">
          Civil Registry Review
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Review Jobs
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Review submitted civil registry records and take the appropriate
          action.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Pending"
          value={pendingCount}
          description="Waiting for review"
          icon={Clock3}
          className="text-amber-600"
        />

        <SummaryCard
          title="Returned"
          value={returnedCount}
          description="Returned for correction"
          icon={RotateCcw}
          className="text-red-600"
        />

        <SummaryCard
          title="Approved"
          value={approvedCount}
          description="Completed reviews"
          icon={CheckCircle2}
          className="text-emerald-600"
        />
      </div>

      {/* Controls */}
      <Card className="rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-[#92191d]" />

          <h2 className="font-semibold text-slate-900">Filter Review Jobs</h2>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by subject or submitting clerk"
              className="pl-10"
            />
          </div>

          <select
            value={recordType}
            onChange={(event) =>
              setRecordType(
                event.target.value as "All" | "Birth" | "Marriage" | "Death",
              )
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
          {(["Pending", "Returned", "Approved", "All"] as const).map((item) => (
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
              {item}
            </button>
          ))}
        </div>
      </Card>

      {/* Jobs */}
      <Card className="overflow-hidden rounded-xl border border-slate-200">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            {status === "All" ? "All Review Jobs" : `${status} Jobs`}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredJobs.length} job
            {filteredJobs.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="mx-auto h-9 w-9 text-slate-300" />

            <p className="mt-3 font-medium text-slate-700">
              No review jobs found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Try changing the selected filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Record Subject</th>
                  <th className="px-5 py-3">Submitted By</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <RecordTypeBadge type={job.type} />
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {job.subjectName}
                      </p>

                      {job.reviewComment && (
                        <p className="mt-1 max-w-[350px] truncate text-xs text-red-500">
                          {job.reviewComment}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {job.submittedBy}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {formatDateTime(job.submittedAt)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={job.status} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Button
                        asChild
                        size="sm"
                        variant={
                          job.status === "Pending" ? "default" : "outline"
                        }
                        className={
                          job.status === "Pending"
                            ? "bg-[#92191d] text-white hover:bg-[#761216]"
                            : undefined
                        }
                      >
                        <Link href={`/reviewer/jobs/${job.id}`}>
                          <Eye className="mr-2 h-4 w-4" />

                          {job.status === "Pending" ? "Review" : "View"}
                        </Link>
                      </Button>
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

function RecordTypeBadge({ type }: { type: ReviewerJob["type"] }) {
  const styles = {
    Birth: "bg-blue-50 text-blue-700",
    Marriage: "bg-pink-50 text-pink-700",
    Death: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[type]}`}
    >
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: JobStatus }) {
  const styles: Record<JobStatus, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Returned: "bg-red-50 text-red-700",
    Approved: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function formatDateTime(value: string) {
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
