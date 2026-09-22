"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  Loader2,
} from "lucide-react";

import BirthCertificatePreview from "@/components/reusable/BirthCertificatePreview";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  useBirthRegistration,
  useRegisterBirthCertificate,
} from "@/server/hooks/birthcertificateHooks";

import { getProfile } from "@/server/hooks/authHooks";

import { mapBirthRecordToFormData } from "@/lib/mappers/birthRegistrationMapper";

export default function RegisterBirthCertificatePage() {
  const params = useParams();
  const router = useRouter();

  // ============================================================
  // ROUTE PARAM
  // ============================================================

  const certificateId = params.id as string;

  // ============================================================
  // STATE
  // ============================================================

  const [registryNumber, setRegistryNumber] = useState("");

  const [actionError, setActionError] = useState<string | null>(null);

  // ============================================================
  // REGISTER MUTATION
  // ============================================================

  const registerBirthCertificateMutation = useRegisterBirthCertificate();

  const isRegistering = registerBirthCertificateMutation.isPending;

  // ============================================================
  // CURRENT REGISTRAR / ADMIN
  // ============================================================

  const { data: profileData, isLoading: isProfileLoading } = getProfile();

  const currentRegistrar = profileData?.data;

  // ============================================================
  // LOAD BIRTH REGISTRATION
  // ============================================================

  const { data, isLoading, isError, error } =
    useBirthRegistration(certificateId);

  const record = data?.data;

  // ============================================================
  // REGISTRAR DISPLAY
  // ============================================================
  //
  // If the certificate has already been registered, use the
  // Registrar persisted in the Birth Registration record.
  //
  // Otherwise, show the currently authenticated Admin/Registrar
  // who is performing the registration.
  //
  // ============================================================

  const registrar = record?.registrar ?? currentRegistrar ?? null;

  // ============================================================
  // MAP RECORD TO CERTIFICATE PREVIEW
  // ============================================================

  const previewData = useMemo(() => {
    if (!record) {
      return null;
    }

    return mapBirthRecordToFormData(record);
  }, [record]);

  // ============================================================
  // CHILD NAME
  // ============================================================

  const childName = useMemo(() => {
    if (!record?.child) {
      return "Birth Certificate";
    }

    return [
      record.child.firstName,
      record.child.middleName,
      record.child.lastName,
    ]
      .filter(Boolean)
      .join(" ");
  }, [record]);

  // ============================================================
  // REGISTER
  // ============================================================

  const handleRegister = async () => {
    if (isRegistering) {
      return;
    }

    const cleanRegistryNumber = registryNumber.trim();

    if (!cleanRegistryNumber) {
      setActionError("Please enter the official registry number.");

      return;
    }

    setActionError(null);

    try {
      await registerBirthCertificateMutation.mutateAsync({
        certificateId,
        registryNumber: cleanRegistryNumber,
      });

      router.push("/admin/jobs");
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Unable to register the birth certificate.",
      );
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#92191d]" />

          <p className="mt-3 text-sm text-slate-500">
            Loading birth certificate...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (isError || !record || !previewData) {
    return (
      <div className="mx-auto max-w-xl py-10">
        <Card className="p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>

          <h2 className="mt-4 font-semibold text-slate-900">
            Unable to load certificate
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error instanceof Error
              ? error.message
              : "The birth certificate could not be found."}
          </p>

          <Button variant="outline" className="mt-5" asChild>
            <Link href="/admin/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Registry
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  // ============================================================
  // ALREADY REGISTERED
  // ============================================================

  if (record.registryNumber) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Button variant="ghost" className="-ml-3" asChild>
          <Link href="/admin/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Birth Registry
          </Link>
        </Button>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Certificate Already Registered
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                This birth certificate already has an official registry number.
              </p>

              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Registry Number
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {record.registryNumber}
                </p>
              </div>

              {record.registrar && (
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Registered By
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {formatUserName(record.registrar)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* ====================================================== */}
      {/* BACK */}
      {/* ====================================================== */}

      <Button variant="ghost" className="-ml-3" asChild>
        <Link href="/admin/jobs">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Birth Registry
        </Link>
      </Button>

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
              Approved
            </span>

            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              Awaiting Registration
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            Register Birth Certificate
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review the approved certificate and assign its official registry
            number.
          </p>
        </div>
      </div>

      {/* ====================================================== */}
      {/* CERTIFICATE INFORMATION */}
      {/* ====================================================== */}

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
              <FileCheck2 className="h-4 w-4 text-[#92191d]" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Certificate Information
              </h2>

              <p className="text-xs text-slate-500">{childName}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-0 divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0">
          <InfoItem
            label="Prepared By"
            value={formatUserName(record.preparedByUser)}
          />

          <InfoItem
            label="Received By"
            value={formatUserName(record.receivedByUser)}
          />

          <InfoItem label="Registrar" value={formatUserName(registrar)} />
        </div>
      </Card>

      {/* ====================================================== */}
      {/* CERTIFICATE PREVIEW */}
      {/* ====================================================== */}

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Birth Certificate Preview
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Verify the approved information before assigning the official
            registry number.
          </p>
        </div>

        <div className="overflow-x-auto bg-slate-100 p-4 md:p-6">
          <div className="mx-auto min-w-[900px] max-w-[1100px]">
            <BirthCertificatePreview
              childData={previewData}
              previewMode="record"
              preparedBy={record.preparedByUser}
              preparedDate={record.createdAt}
              receivedBy={record.receivedByUser}
              receivedDate={record.updatedAt}
              registrar={registrar}
            />
          </div>
        </div>
      </Card>

      {/* ====================================================== */}
      {/* REGISTRATION SECTION */}
      {/* ====================================================== */}

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Official Registration
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Enter the registry number assigned to this birth certificate.
          </p>
        </div>

        <div className="p-5 md:p-6">
          <div className="max-w-xl">
            <Label
              htmlFor="registryNumber"
              className="text-sm font-medium text-slate-700"
            >
              Registry Number
              <span className="ml-1 text-red-500">*</span>
            </Label>

            <Input
              id="registryNumber"
              type="text"
              value={registryNumber}
              disabled={isRegistering}
              onChange={(event) => {
                setRegistryNumber(event.target.value);

                if (actionError) {
                  setActionError(null);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();

                  handleRegister();
                }
              }}
              placeholder="e.g. 2026-000123"
              autoComplete="off"
              className="mt-2"
            />

            <p className="mt-2 text-xs text-slate-500">
              Enter the official registry number exactly as it should appear on
              the certificate.
            </p>

            {actionError && (
              <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                <p className="text-sm text-red-700">{actionError}</p>
              </div>
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* ACTIONS */}
        {/* ==================================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isRegistering}
            asChild={!isRegistering}
          >
            {isRegistering ? (
              <span>Cancel</span>
            ) : (
              <Link href="/admin/jobs">Cancel</Link>
            )}
          </Button>

          <Button
            type="button"
            disabled={isRegistering || !registryNumber.trim()}
            onClick={handleRegister}
            className="bg-[#92191d] text-white hover:bg-[#761216]"
          >
            {isRegistering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <FileCheck2 className="mr-2 h-4 w-4" />
                Register Certificate
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// INFO ITEM
// ============================================================

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

// ============================================================
// FORMAT USER NAME
// ============================================================

function formatUserName(
  user:
    | {
        first_name?: string | null;
        middle_name?: string | null;
        last_name?: string | null;
      }
    | null
    | undefined,
) {
  if (!user) {
    return "—";
  }

  return [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(" ");
}
