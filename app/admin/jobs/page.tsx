"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FilePenLine,
  Loader2,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useRegistrarBirthRegistrations } from "@/server/hooks/transactionHooks";

type RegistryFilter = "For Registration" | "Registered" | "All";

export default function AdminBirthRegistrationsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<RegistryFilter>("For Registration");

  // ============================================================
  // REGISTRAR BIRTH REGISTRATIONS
  //
  // Transaction is the source of truth.
  // The backend only returns:
  //
  // transaction_purpose = "Birth"
  // status = "Approved"
  // ============================================================

  const { data, isLoading, isError, error } = useRegistrarBirthRegistrations();

  const registrations = data?.data ?? [];

  // ============================================================
  // REGISTRATION STATE
  // ============================================================

  const forRegistration = useMemo(() => {
    return registrations.filter(
      (job) => !job.birthRegistration?.registryNumber,
    );
  }, [registrations]);

  const registered = useMemo(() => {
    return registrations.filter((job) =>
      Boolean(job.birthRegistration?.registryNumber),
    );
  }, [registrations]);

  // ============================================================
  // FILTER + SEARCH
  // ============================================================

  const filteredRegistrations = useMemo(() => {
    let records = registrations;

    if (filter === "For Registration") {
      records = forRegistration;
    }

    if (filter === "Registered") {
      records = registered;
    }

    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return records;
    }

    return records.filter((job) => {
      const childName = job.childName?.toLowerCase() ?? "";

      const registryNumber =
        job.birthRegistration?.registryNumber?.toLowerCase() ?? "";

      const clerkName = job.clerk
        ? [job.clerk.first_name, job.clerk.middle_name, job.clerk.last_name]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
        : "";

      const reviewerName = job.reviewer
        ? [
            job.reviewer.first_name,
            job.reviewer.middle_name,
            job.reviewer.last_name,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
        : "";

      return (
        childName.includes(keyword) ||
        registryNumber.includes(keyword) ||
        clerkName.includes(keyword) ||
        reviewerName.includes(keyword)
      );
    });
  }, [registrations, forRegistration, registered, filter, search]);

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#92191d]" />

          <p className="mt-3 text-sm text-slate-500">
            Loading birth registrations...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (isError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>

          <h2 className="mt-4 font-semibold text-slate-900">
            Unable to load registrations
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error instanceof Error
              ? error.message
              : "Unable to load approved birth registrations."}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92191d]">
          City of Kabankalan Registry System
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Birth Certificate Registry
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Register approved birth certificates and assign their official
          registry numbers.
        </p>
      </div>

      {/* ====================================================== */}
      {/* SUMMARY CARDS */}
      {/* ====================================================== */}

      <div className="grid gap-4 md:grid-cols-3">
        {/* For Registration */}

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                For Registration
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {forRegistration.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Approved certificates awaiting registry number
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <ClipboardList className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </Card>

        {/* Registered */}

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Registered</p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {registered.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Certificates with assigned registry numbers
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <FileCheck2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Total Approved */}

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Approved
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {registrations.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Reviewer-approved birth registrations
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
              <CheckCircle2 className="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* ====================================================== */}
      {/* REGISTRY TABLE */}
      {/* ====================================================== */}

      <Card className="overflow-hidden">
        {/* Toolbar */}

        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">
                Birth Registrations
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Only reviewer-approved registrations are shown.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search child or registry no."
                  className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#92191d] focus:ring-2 focus:ring-[#92191d]/10 sm:w-64"
                />
              </div>

              {/* Filter */}

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as RegistryFilter)
                }
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#92191d] focus:ring-2 focus:ring-[#92191d]/10"
              >
                <option value="For Registration">For Registration</option>

                <option value="Registered">Registered</option>

                <option value="All">All Approved</option>
              </select>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* TABLE */}
        {/* ==================================================== */}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/80">
              <tr>
                <th className="whitespace-nowrap px-5 py-3 font-medium text-slate-500">
                  Child
                </th>

                <th className="whitespace-nowrap px-5 py-3 font-medium text-slate-500">
                  Registry Number
                </th>

                <th className="whitespace-nowrap px-5 py-3 font-medium text-slate-500">
                  Prepared By
                </th>

                <th className="whitespace-nowrap px-5 py-3 font-medium text-slate-500">
                  Received By
                </th>

                <th className="whitespace-nowrap px-5 py-3 font-medium text-slate-500">
                  Date Approved
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-right font-medium text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                      <ClipboardList className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="mt-3 font-medium text-slate-700">
                      No birth registrations found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {filter === "For Registration"
                        ? "There are currently no approved certificates waiting for registration."
                        : filter === "Registered"
                          ? "There are currently no registered birth certificates."
                          : "No approved birth registrations found."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((job) => {
                  const registration = job.birthRegistration;

                  const preparedBy = job.clerk;

                  const receivedBy = job.reviewer;

                  return (
                    <tr
                      key={job.transactionId}
                      className="transition hover:bg-slate-50/70"
                    >
                      {/* Child */}

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {job.childName ||
                            "Registrant information unavailable"}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          Birth Certificate
                        </p>
                      </td>

                      {/* Registry Number */}

                      <td className="px-5 py-4">
                        {registration?.registryNumber ? (
                          <span className="font-medium text-slate-800">
                            {registration.registryNumber}
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                            Not Assigned
                          </span>
                        )}
                      </td>

                      {/* Prepared By */}

                      <td className="px-5 py-4 text-slate-600">
                        {preparedBy
                          ? [preparedBy.first_name, preparedBy.last_name]
                              .filter(Boolean)
                              .join(" ")
                          : "—"}
                      </td>

                      {/* Received By */}

                      <td className="px-5 py-4 text-slate-600">
                        {receivedBy
                          ? [receivedBy.first_name, receivedBy.last_name]
                              .filter(Boolean)
                              .join(" ")
                          : "—"}
                      </td>

                      {/* Approved Date */}

                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {job.reviewedAt ? formatDate(job.reviewedAt) : "—"}
                      </td>

                      {/* Action */}

                      <td className="px-5 py-4 text-right">
                        {registration?.registryNumber ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/admin/birth-registrations/${job.certificateId}`}
                            >
                              View
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-[#92191d] text-white hover:bg-[#761216]"
                            asChild
                          >
                            <Link
                              href={`/admin/jobs/${job.certificateId}/register`}
                            >
                              <FilePenLine className="mr-2 h-4 w-4" />
                              Register
                            </Link>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ==================================================== */}
        {/* FOOTER */}
        {/* ==================================================== */}

        <div className="border-t border-slate-200 bg-slate-50/50 px-5 py-3">
          <p className="text-xs text-slate-500">
            Showing {filteredRegistrations.length} of {registrations.length}{" "}
            approved birth registrations.
          </p>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// DATE FORMATTER
// ============================================================

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
