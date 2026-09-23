"use client";

import {
  Download,
  Loader2,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AnalyticsSection from "@/components/analytics/AnalyticsSection";

import type {
  NationalitySearchData,
  ReportsBundleData,
} from "@/server/api/Analytics";

const csvEscape = (value: unknown) => {
  const text = String(value ?? "");

  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const downloadCsv = (filename: string, rows: (string | number)[][]) => {
  const csv = rows
    .map((row) => row.map((cell) => csvEscape(cell)).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = filename;

  link.click();

  URL.revokeObjectURL(url);
};

const formatDate = (value: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? String(value).slice(0, 10)
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const residencyBadge = (isResident: boolean | null) => {
  if (isResident === null) {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        Unknown
      </span>
    );
  }

  return isResident ? (
    <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
      Resident
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
      Non-resident
    </span>
  );
};

interface ResidencyRow {
  id: string;
  createdAt: string;
  isResident: boolean | null;
}

interface ResidencySummaryProps {
  title: string;
  description: string;
  data: {
    total: number;
    resident: number;
    nonResident: number;
    rows: (ResidencyRow & Record<string, unknown>)[];
  };
  onExport: () => void;
}

function ResidencySummary({
  title,
  description,
  data,
  onExport,
}: ResidencySummaryProps) {
  const known = data.resident + data.nonResident;

  const residentPct =
    known > 0 ? Math.round((data.resident / known) * 100) : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>

          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-8 px-3 text-xs"
          disabled={data.rows.length === 0}
          onClick={onExport}
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          CSV
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-slate-50 p-3 text-center">
          <p className="text-xs font-medium text-slate-500">Total</p>

          <p className="mt-1 text-xl font-bold text-slate-900">{data.total}</p>
        </div>

        <div className="rounded-lg bg-emerald-50 p-3 text-center">
          <p className="text-xs font-medium text-emerald-600">Resident</p>

          <p className="mt-1 text-xl font-bold text-emerald-700">
            {data.resident}
          </p>
        </div>

        <div className="rounded-lg bg-amber-50 p-3 text-center">
          <p className="text-xs font-medium text-amber-600">Non-resident</p>

          <p className="mt-1 text-xl font-bold text-amber-700">
            {data.nonResident}
          </p>
        </div>
      </div>

      {residentPct !== null && (
        <p className="mt-3 text-xs text-slate-400">
          {residentPct}% of records with a known address are Kabankalan
          residents.
        </p>
      )}

      {data.rows.length > 0 && (
        <div className="mt-4 max-h-64 overflow-y-auto rounded-lg border border-slate-100">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Name</th>

                <th className="px-3 py-2 font-medium">Date</th>

                <th className="px-3 py-2 font-medium">Residency</th>
              </tr>
            </thead>

            <tbody>
              {data.rows.map((row) => {
                const displayName =
                  typeof row.motherName === "string" && row.motherName
                    ? `${String(row.name)} (mother: ${row.motherName})`
                    : typeof row.groom === "string" && row.groom
                      ? `${row.groom} & ${String(row.bride)}`
                      : typeof row.name === "string"
                        ? row.name
                        : "—";

                return (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 text-slate-700">
                    {displayName || "—"}
                  </td>

                  <td className="px-3 py-2 text-slate-500">
                    {formatDate(row.createdAt)}
                  </td>

                  <td className="px-3 py-2">
                    {residencyBadge(row.isResident)}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface ReportsSectionProps {
  reports: ReportsBundleData;
  nationalitySearch: {
    query: string;
    onQueryChange: (value: string) => void;
    isSearching: boolean;
    data: NationalitySearchData | undefined;
  };
}

/**
 * Reports-sidebar content driven by GET /api/analytics/reports/all and
 * /api/analytics/reports/nationality: resident vs non-resident breakdowns,
 * cross-record nationality search and the heuristic dual-event /
 * multiple-marriage flags.
 */
export default function ReportsSection({
  reports,
  nationalitySearch,
}: ReportsSectionProps) {
  const { residency, dualEvents, multipleMarriages } = reports;

  const { query, onQueryChange, isSearching, data: search } = nationalitySearch;

  const exportBirth = () =>
    downloadCsv("birth-residency.csv", [
      ["Child", "Mother", "Registered", "City", "Residency"],
      ...residency.birth.rows.map((row) => [
        row.name,
        row.motherName,
        formatDate(row.createdAt),
        row.city,
        row.isResident ? "Resident" : "Non-resident",
      ]),
    ]);

  const exportMarriage = () =>
    downloadCsv("marriage-residency.csv", [
      ["Groom", "Bride", "Registered", "Residency"],
      ...residency.marriage.rows.map((row) => [
        row.groom,
        row.bride,
        formatDate(row.createdAt),
        row.isResident === null ? "Unknown" : row.isResident ? "Resident" : "Non-resident",
      ]),
    ]);

  const exportDeath = () =>
    downloadCsv("death-residency.csv", [
      ["Name", "Registered", "Residency"],
      ...residency.death.rows.map((row) => [
        row.name,
        formatDate(row.createdAt),
        row.isResident === null ? "Unknown" : row.isResident ? "Resident" : "Non-resident",
      ]),
    ]);

  const searchRows = search
    ? [
        ...search.results.birth.map((row) => ({ ...row, type: "Birth" as const })),
        ...search.results.marriage.map((row) => ({
          ...row,
          type: "Marriage" as const,
        })),
        ...search.results.death.map((row) => ({ ...row, type: "Death" as const })),
      ]
    : [];

  return (
    <>
      {/* ===================================================== */}
      {/* RESIDENT VS NON-RESIDENT */}
      {/* ===================================================== */}

      <AnalyticsSection
        title="Resident vs Non-resident"
        description="Kabankalan residency per record type, based on the address on file."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <ResidencySummary
            title="Birth"
            description="Based on the mother's residence."
            data={residency.birth}
            onExport={exportBirth}
          />

          <ResidencySummary
            title="Marriage"
            description="Either party residing in Kabankalan counts as resident."
            data={residency.marriage}
            onExport={exportMarriage}
          />

          <ResidencySummary
            title="Death"
            description="Based on the deceased's registered address."
            data={residency.death}
            onExport={exportDeath}
          />
        </div>

        <p className="text-xs text-slate-400">
          Marriage and death residency show as Unknown until residence addresses
          are captured on those registration forms.
        </p>
      </AnalyticsSection>

      {/* ===================================================== */}
      {/* NATIONALITY SEARCH */}
      {/* ===================================================== */}

      <AnalyticsSection
        title="Search by Nationality"
        description="Search registrations across birth, marriage and death records."
      >
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="e.g. Filipino"
                className="pl-9"
              />
            </div>

            {isSearching && (
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            )}
          </div>

          {searchRows.length > 0 ? (
            <div className="mt-4 max-h-72 overflow-y-auto rounded-lg border border-slate-100">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-medium">Type</th>

                    <th className="px-3 py-2 font-medium">Name</th>

                    <th className="px-3 py-2 font-medium">Detail</th>

                    <th className="px-3 py-2 font-medium">Registered</th>
                  </tr>
                </thead>

                <tbody>
                  {searchRows.map((row) => (
                    <tr
                      key={`${row.type}-${row.id}`}
                      className="border-t border-slate-100"
                    >
                      <td className="px-3 py-2">
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                          {row.type}
                        </span>
                      </td>

                      <td className="px-3 py-2 text-slate-700">
                        {row.name || "—"}
                      </td>

                      <td className="px-3 py-2 text-slate-500">
                        {row.detail || "—"}
                      </td>

                      <td className="px-3 py-2 text-slate-500">
                        {formatDate(row.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-slate-400">
                {query.trim()
                  ? "No matching registrations found."
                  : "Type a nationality to search registered records."}
              </p>
            </div>
          )}
        </div>
      </AnalyticsSection>

      {/* ===================================================== */}
      {/* DUAL EVENT + MULTIPLE MARRIAGE */}
      {/* ===================================================== */}

      <AnalyticsSection
        title="Linked Event Flags"
        description="Heuristic detection — matched on full name; verify before acting."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-900">Dual Event</h3>

                <p className="mt-1 text-sm text-slate-500">
                  A birth and a death registered for the same person.
                </p>
              </div>

              <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                {dualEvents?.count ?? 0}
              </span>
            </div>

            {dualEvents && dualEvents.results.length > 0 ? (
              <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
                {dualEvents.results.map((row) => (
                  <div
                    key={`${row.birthRecordId}-${row.deathRecordId}`}
                    className="rounded-lg border border-slate-100 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-800">
                        {row.name}
                      </p>

                      {row.sameDay && (
                        <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600">
                          Same day
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Born {formatDate(row.dateOfBirth)} · Died{" "}
                      {formatDate(row.dateOfDeath)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-slate-400">
                  No dual-event records detected.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Multiple Marriage
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Either party has more than one marriage record on file.
                </p>
              </div>

              <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                {multipleMarriages?.count ?? 0}
              </span>
            </div>

            {multipleMarriages && multipleMarriages.results.length > 0 ? (
              <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
                {multipleMarriages.results.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-lg border border-slate-100 p-3"
                  >
                    <p className="text-sm font-medium text-slate-800">
                      {row.groom || "—"} &amp; {row.bride || "—"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Married {formatDate(row.dateOfMarriage)} · Groom records:{" "}
                      {row.groomMarriageCount} · Bride records:{" "}
                      {row.brideMarriageCount}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-slate-400">
                  No multiple-marriage records detected.
                </p>
              </div>
            )}
          </div>
        </div>
      </AnalyticsSection>
    </>
  );
}
