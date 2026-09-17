"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  RotateCcw,
} from "lucide-react";

import BirthCertificatePreview from "@/components/reusable/BirthCertificatePreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useBirthRegistration } from "@/server/hooks/birthcertificateHooks";
import { mapBirthRecordToFormData } from "@/lib/mappers/birthRegistrationMapper";
import { getProfile } from "@/server/hooks/authHooks";
import { useReturnJob } from "@/server/hooks/jobsHooks";

export default function JobReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  // This page currently receives the Birth Registration / certificate ID.
  const certificateId = params.id;

  const { data, isLoading, isError, error } =
    useBirthRegistration(certificateId);

  const { data: profileData } = getProfile();

  const returnJobMutation = useReturnJob();

  const [approveLoading, setApproveLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");

  const record = data?.data;
  const currentUser = profileData?.data;

  const isReturning = returnJobMutation.isPending;
  const isActionLoading = approveLoading || isReturning;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#92191d]" />

          <p className="mt-3 text-sm text-slate-500">Loading birth record...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-lg p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-red-50 p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Unable to load birth record
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {error instanceof Error
                  ? error.message
                  : "Unable to load birth record."}
              </p>

              <Button asChild variant="outline" className="mt-4">
                <Link href="/reviewer/jobs">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Jobs
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="p-6 text-center">
          <p className="font-semibold text-slate-900">Birth record not found</p>

          <Button asChild variant="outline" className="mt-4">
            <Link href="/reviewer/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Convert API record into the format expected by BirthCertificatePreview.
  const previewData = mapBirthRecordToFormData(record);

  const handleApprove = async () => {
    setApproveLoading(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/reviewer/jobs/${certificateId}/approve`, {
        method: "POST",
      });

      if (!res.ok) {
        const result = await res.json().catch(() => null);

        throw new Error(result?.message ?? "Failed to approve job.");
      }

      router.push("/reviewer/jobs");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to approve job.",
      );
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReturn = async () => {
    const reason = returnReason.trim();

    if (!reason) {
      return;
    }

    setActionError(null);

    try {
      await returnJobMutation.mutateAsync({
        certificateId,
        reason,
      });

      // Clear only after successful return.
      setReturnReason("");
      setShowReturnModal(false);

      router.push("/reviewer/jobs");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to return job.",
      );

      // Keep the modal open so the reviewer doesn't lose the reason.
    }
  };

  const handleOpenReturnModal = () => {
    setActionError(null);
    setShowReturnModal(true);
  };

  const handleCloseReturnModal = () => {
    if (isReturning) {
      return;
    }

    setShowReturnModal(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92191d]">
            City of Kabankalan Registry System
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Birth Certificate Review
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review the submitted birth certificate before approval.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/reviewer/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
      </div>

      {/* Registration summary */}
      <Card className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Child
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {previewData.childFirstName} {previewData.childMiddleName}{" "}
              {previewData.childLastName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">Birth Registration</p>
          </div>

          <div className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
            Pending Review
          </div>
        </div>
      </Card>

      {/* Certificate */}
      <Card className="overflow-x-auto p-5">
        <BirthCertificatePreview
          childData={previewData}
          previewMode="record"
          preparedBy={record.preparedByUser}
          preparedDate={record.createdAt}
          receivedBy={currentUser}
        />
      </Card>

      {/* Action error */}
      {actionError && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <div>
            <p className="font-medium">Action failed</p>
            <p className="mt-0.5">{actionError}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <Card className="p-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Review Decision
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Approve the registration or return it to the clerk for correction.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenReturnModal}
              disabled={isActionLoading}
              className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Return for Correction
            </Button>

            <Button
              type="button"
              onClick={handleApprove}
              disabled={isActionLoading}
              className="bg-[#92191d] hover:bg-[#7c1518]"
            >
              {approveLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Return modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-red-50 p-2.5">
                <RotateCcw className="h-5 w-5 text-red-700" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Return for Correction
                </h2>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Explain what needs to be corrected. Your comment will be sent
                  to the submitting clerk.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="return-reason"
                className="text-sm font-medium text-slate-700"
              >
                Correction reason
              </label>

              <textarea
                id="return-reason"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                rows={5}
                maxLength={500}
                disabled={isReturning}
                className="mt-2 w-full resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:border-[#92191d] focus:ring-2 focus:ring-[#92191d]/10 disabled:bg-slate-50"
                placeholder="e.g. Mother's residence address is incomplete."
                autoFocus
              />

              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>Be specific about what the clerk needs to correct.</span>

                <span>{returnReason.length}/500</span>
              </div>
            </div>

            {actionError && (
              <div className="mt-4 flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseReturnModal}
                disabled={isReturning}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleReturn}
                disabled={!returnReason.trim() || isReturning}
                className="bg-[#92191d] hover:bg-[#7c1518]"
              >
                {isReturning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Returning...
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Confirm Return
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
