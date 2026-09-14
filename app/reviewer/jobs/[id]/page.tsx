"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import BirthCertificatePreview from "@/components/reusable/BirthCertificatePreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useBirthRegistration } from "@/server/hooks/birthcertificateHooks";
import { mapBirthRecordToFormData } from "@/lib/mappers/birthRegistrationMapper";
import { getProfile } from "@/server/hooks/authHooks";

export default function JobReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params.id;

  const { data, isLoading, isError, error } = useBirthRegistration(id);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");

  const record = data?.data;

  const { data: profileData } = getProfile();

  const currentUser = profileData?.data;

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

  // Convert API record into the format expected by BirthCertificatePreview
  const previewData = mapBirthRecordToFormData(record);

  const handleApprove = async () => {
    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/reviewer/jobs/${id}/approve`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to approve job.");
      }

      router.push("/reviewer/jobs");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to approve job.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!returnReason.trim()) return;

    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/reviewer/jobs/${id}/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: returnReason.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to return job.");
      }

      router.push("/reviewer/jobs");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to return job.",
      );
    } finally {
      setActionLoading(false);
      setShowReturnModal(false);
    }
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

      {/* Person name */}
      <Card className="p-5">
        <div>
          <p className="text-xs text-slate-500">Child</p>

          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            {previewData.childFirstName} {previewData.childMiddleName}{" "}
            {previewData.childLastName}
          </h2>
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
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => setShowReturnModal(true)}
          disabled={actionLoading}
          className="border-red-800 text-red-800"
        >
          Return for Correction
        </Button>

        <Button
          onClick={handleApprove}
          disabled={actionLoading}
          className="bg-[#92191d] hover:bg-[#7c1518]"
        >
          {actionLoading ? "Approving..." : "Approve"}
        </Button>
      </div>

      {/* Return modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Return Job</h2>

            <p className="mt-1 text-sm text-slate-500">
              Explain what needs to be corrected. This will be sent back to the
              submitting clerk.
            </p>

            <textarea
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              rows={4}
              className="mt-4 w-full rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-[#92191d]"
              placeholder="e.g. Mother's residence address is incomplete."
            />

            <div className="mt-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowReturnModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>

              <Button
                onClick={handleReturn}
                disabled={!returnReason.trim() || actionLoading}
                className="bg-[#92191d] hover:bg-[#7c1518]"
              >
                {actionLoading ? "Returning..." : "Confirm Return"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
