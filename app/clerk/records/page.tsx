"use client";

import { useState } from "react";

import RecordsControl from "@/components/reusable/RecordsControl";
import RecordsTable from "@/components/records/RecordsTable";

import { useBirthRegistrations } from "@/server/hooks/birthcertificateHooks";

export type RecordType = "all" | "birth" | "death" | "marriage";

export default function Page() {
  const [recordType, setRecordType] = useState<RecordType>("birth");

  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, refetch, isFetching } =
    useBirthRegistrations();

  const birthRecords = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92191d]">
          Civil Registry Records
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Records Management
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Search and review registered civil registry records.
        </p>
      </div>

      {/* Controls */}
      <RecordsControl
        recordType={recordType}
        search={search}
        onRecordTypeChange={setRecordType}
        onSearchChange={setSearch}
      />

      {/* Records */}
      <RecordsTable
        records={birthRecords}
        recordType={recordType}
        search={search}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
        isRefreshing={isFetching}
      />
    </div>
  );
}
