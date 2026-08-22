"use client";

import { AlertCircle, Baby, Eye, Loader2, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

import { BirthRegistrationRecord } from "@/lib/types/birth-registration";

interface RecordsTableProps {
  records: BirthRegistrationRecord[];

  recordType: "all" | "birth" | "death" | "marriage";

  search: string;

  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;

  onRetry: () => void;
  isRefreshing: boolean;
}

const current_user_role = sessionStorage.getItem("current_user_role");

export default function RecordsTable({
  records,
  recordType,
  search,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  isRefreshing,
}: RecordsTableProps) {
  if (isLoading) {
    return <RecordsLoading />;
  }

  if (isError) {
    return (
      <RecordsError
        message={errorMessage ?? "Unable to load birth registrations."}
        onRetry={onRetry}
        isRetrying={isRefreshing}
      />
    );
  }

  const normalizedSearch = search.trim().toLowerCase();

  const filteredRecords = records.filter((record) => {
    /**
     * For now the API only contains
     * birth records.
     */
    const matchesType = recordType === "all" || recordType === "birth";

    const fullName = [
      record.child?.firstName,
      record.child?.middleName,
      record.child?.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const registryNumber = record.registryNumber?.toLowerCase() ?? "";

    const matchesSearch =
      !normalizedSearch ||
      fullName.includes(normalizedSearch) ||
      registryNumber.includes(normalizedSearch);

    return matchesType && matchesSearch;
  });

  return (
    <Card className="overflow-hidden rounded-xl border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-900">Birth Records</h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredRecords.length} record
            {filteredRecords.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isRefreshing}
          onClick={onRetry}
        >
          {isRefreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Empty */}
      {filteredRecords.length === 0 ? (
        <div className="p-12 text-center">
          <Baby className="mx-auto h-9 w-9 text-slate-300" />

          <p className="mt-3 font-medium text-slate-700">
            No birth records found
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Try changing the search term or record filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Registry No.</th>

                <th className="px-5 py-3">Name</th>

                <th className="px-5 py-3">Sex</th>

                <th className="px-5 py-3">Date of Birth</th>

                <th className="px-5 py-3">Place of Birth</th>

                <th className="px-5 py-3">Registered</th>

                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredRecords.map((record) => (
                <BirthRecordRow key={record.id} record={record} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function BirthRecordRow({ record }: { record: BirthRegistrationRecord }) {
  const childName = [
    record.child?.firstName,
    record.child?.middleName,
    record.child?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const placeOfBirth = [
    record.child?.hospitalName,
    record.child?.placeOfBirth?.cityName,
    record.child?.placeOfBirth?.provinceName,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-5 py-4">
        <span className="font-mono text-xs text-slate-700">
          {record.registryNumber || "Not assigned"}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Baby className="h-4 w-4" />
          </div>

          <div>
            <p className="font-medium text-slate-900">
              {childName || "Unnamed record"}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">Birth Registration</p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4 text-slate-600">
        {record.child?.gender || "—"}
      </td>

      <td className="px-5 py-4 text-slate-600">
        {formatDate(record.child?.birthDate)}
      </td>

      <td className="max-w-[280px] px-5 py-4 text-slate-600">
        <p className="truncate">{placeOfBirth || "—"}</p>
      </td>

      <td className="px-5 py-4 text-slate-500">
        {formatDateTime(record.createdAt)}
      </td>

      <td className="px-5 py-4 text-right">
        <Button asChild size="sm" variant="outline">
          <Link
            href={
              current_user_role === "Staff"
                ? `/clerk/records/${record.id}`
                : current_user_role === "Reviewer"
                  ? `/reviewer/records/${record.id}`
                  : current_user_role === "Admin"
                    ? `/admin/records/${record.id}`
                    : "/"
            }
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>
      </td>
    </tr>
  );
}

function RecordsLoading() {
  return (
    <Card className="overflow-hidden">
      <div className="border-b px-5 py-4">
        <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

        <div className="mt-2 h-4 w-24 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="space-y-1 p-4">
        {Array.from({
          length: 5,
        }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-lg bg-slate-50"
          />
        ))}
      </div>
    </Card>
  );
}

function RecordsError({
  message,
  onRetry,
  isRetrying,
}: {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
}) {
  return (
    <Card className="p-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>

        <h2 className="mt-4 font-semibold text-slate-900">
          Unable to load records
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>

        <Button
          type="button"
          variant="outline"
          className="mt-5"
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
    </Card>
  );
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
