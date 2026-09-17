"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Eye,
  FilePenLine,
  Loader2,
  RotateCcw,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useBirthRegistration } from "@/server/hooks/birthcertificateHooks";
import { useClerkJobs } from "@/server/hooks/jobsHooks";

import { mapBirthRecordToFormData } from "@/lib/mappers/birthRegistrationMapper";
import BirthCertificatePreview from "@/components/reusable/BirthCertificatePreview";

export default function ClerkCorrectionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const certificateId = params.id;

  // ============================================================
  // BIRTH REGISTRATION
  // ============================================================

  const {
    data: birthData,
    isLoading: isBirthLoading,
    isError: isBirthError,
    error: birthError,
  } = useBirthRegistration(certificateId);

  // ============================================================
  // CLERK TRANSACTIONS
  // ============================================================

  const {
    data: jobsData,
    isLoading: isJobsLoading,
    isError: isJobsError,
    error: jobsError,
  } = useClerkJobs();

  const record = birthData?.data;

  // Find the transaction associated with this certificate.
  const transaction = jobsData?.data.find(
    (job) => job.certificateId === certificateId,
  );

  // ============================================================
  // LOADING
  // ============================================================

  if (isBirthLoading || isJobsLoading) {
    return <CorrectionLoading />;
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (isBirthError || isJobsError || !record || !transaction) {
    let message = "Unable to load registration.";

    if (birthError instanceof Error) {
      message = birthError.message;
    } else if (jobsError instanceof Error) {
      message = jobsError.message;
    } else if (!record) {
      message = "Birth registration not found.";
    } else if (!transaction) {
      message = "Transaction not found.";
    }

    return <CorrectionError message={message} />;
  }

  // ============================================================
  // PREVIEW DATA
  // ============================================================

  const previewData = mapBirthRecordToFormData(record);

  const isReturned = transaction.status === "Returned";

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="space-y-6 pb-16">
      {/* ====================================================== */}
      {/* BACK */}
      {/* ====================================================== */}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 text-slate-600"
        onClick={() => router.push("/clerk/jobs")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to My Jobs
      </Button>

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92191d]">
            Civil Registry Transaction
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Birth Registration
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {isReturned
              ? "Review the correction requested by the reviewer before updating the registration."
              : "Review the submitted civil registration information."}
          </p>
        </div>

        <StatusBadge status={transaction.status} />
      </div>

      {/* ====================================================== */}
      {/* REVIEWER FEEDBACK */}
      {/* Only display when returned */}
      {/* ====================================================== */}

      {isReturned && (
        <Card className="overflow-hidden rounded-xl border border-red-200">
          {/* Feedback Header */}
          <div className="border-b border-red-100 bg-red-50/70 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <RotateCcw className="h-5 w-5 text-red-600" />
              </div>

              <div>
                <h2 className="font-semibold text-red-900">
                  Returned for Correction
                </h2>

                <p className="mt-0.5 text-sm text-red-700">
                  The reviewer found information that needs to be corrected
                  before this registration can be approved.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5">
            {/* ================================================== */}
            {/* REVIEWER DETAILS */}
            {/* ================================================== */}

            {(transaction.reviewer || transaction.reviewedAt) && (
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Reviewer */}
                {transaction.reviewer && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <UserRound className="h-4 w-4 text-slate-500" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Reviewed By
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {[
                          transaction.reviewer.first_name,
                          transaction.reviewer.last_name,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </p>

                      {transaction.reviewer.position && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {transaction.reviewer.position}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Reviewed Date */}
                {transaction.reviewedAt && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <CalendarDays className="h-4 w-4 text-slate-500" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Reviewed On
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatDateTime(transaction.reviewedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================================================== */}
            {/* REVIEW COMMENT */}
            {/* ================================================== */}

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Reviewer Comment
              </p>

              <div className="rounded-lg border border-red-100 bg-red-50/50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {transaction.reviewComment ||
                      "No correction comment was provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ====================================================== */}
      {/* CERTIFICATE PREVIEW */}
      {/* ====================================================== */}

      <Card className="overflow-hidden rounded-xl border border-slate-200">
        <div className="flex flex-col justify-between gap-3 border-b px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-slate-400" />

              <h2 className="font-semibold text-slate-900">
                Submitted Certificate
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {isReturned
                ? "Review the submitted information and the reviewer's feedback before making corrections."
                : "Review the submitted registration information."}
            </p>
          </div>

          {record.registryNumber && (
            <div className="text-left sm:text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Registry Number
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {record.registryNumber}
              </p>
            </div>
          )}
        </div>

        <div className="overflow-x-auto bg-slate-50 p-4 sm:p-6">
          <div className="mx-auto w-fit">
            <BirthCertificatePreview
              childData={previewData}
              previewMode="record"
              preparedBy={record.preparedByUser}
              preparedDate={record.createdAt}
              receivedBy={record.receivedByUser}
              receivedDate={transaction.reviewedAt}
            />
          </div>
        </div>
      </Card>

      {/* ====================================================== */}
      {/* ACTIONS */}
      {/* ====================================================== */}

      <Card className="rounded-xl border border-slate-200 p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-medium text-slate-900">
              {isReturned
                ? "Ready to make the correction?"
                : "Registration Details"}
            </h3>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              {isReturned
                ? "Update the requested information and resubmit this registration for another review. The existing registration will be updated instead of creating a new one."
                : "This registration is currently read-only."}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/clerk/jobs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>

            {/* Only Returned registrations can be corrected */}
            {isReturned && (
              <Button
                className="bg-[#92191d] text-white hover:bg-[#761216]"
                asChild
              >
                <Link href={`/clerk/jobs/${certificateId}/edit`}>
                  <FilePenLine className="mr-2 h-4 w-4" />
                  Correct Registration
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
  status,
}: {
  status: "Pending" | "Returned" | "Approved";
}) {
  if (status === "Returned") {
    return (
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
        <RotateCcw className="h-3.5 w-3.5" />
        Returned for Correction
      </span>
    );
  }

  if (status === "Approved") {
    return (
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Approved
      </span>
    );
  }

  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
      <span className="h-2 w-2 rounded-full bg-amber-500" />
      Submitted
    </span>
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
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ============================================================
// LOADING
// ============================================================

function CorrectionLoading() {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#92191d]" />

        <p className="mt-3 text-sm text-slate-500">Loading registration...</p>
      </div>
    </div>
  );
}

// ============================================================
// ERROR
// ============================================================

function CorrectionError({ message }: { message: string }) {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>

        <h2 className="mt-4 font-semibold text-slate-900">
          Unable to load registration
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>

        <Button asChild variant="outline" className="mt-5">
          <Link href="/clerk/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Jobs
          </Link>
        </Button>
      </Card>
    </div>
  );
}
