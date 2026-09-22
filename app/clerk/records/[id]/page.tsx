"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Printer,
} from "lucide-react";

import BirthCertificatePreview from "@/components/reusable/BirthCertificatePreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useBirthRegistration } from "@/server/hooks/birthcertificateHooks";
import { mapBirthRecordToFormData } from "@/lib/mappers/birthRegistrationMapper";

export default function BirthRecordViewPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const {
    data,
    isLoading,
    isError,
    error,
  } = useBirthRegistration(id);

  // ============================================================
  // PRINT
  // ============================================================

  const handlePrint = () => {
    window.print();
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#92191d]" />

          <p className="mt-3 text-sm text-slate-500">
            Loading birth record...
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

              <Button
                asChild
                variant="outline"
                className="mt-4"
              >
                <Link href="/clerk/records">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Records
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ============================================================
  // NOT FOUND
  // ============================================================

  if (!data?.data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="p-6 text-center">
          <p className="font-semibold text-slate-900">
            Birth record not found
          </p>

          <Button
            asChild
            variant="outline"
            className="mt-4"
          >
            <Link href="/clerk/records">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Records
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  // ============================================================
  // RECORD
  // ============================================================

  const record = data.data;

  const previewData =
    mapBirthRecordToFormData(record);

  // ============================================================
  // SHARED CERTIFICATE DATA
  // ============================================================

  const certificateProps = {
    childData: previewData,

    preparedBy: record.preparedByUser,
    preparedDate: record.createdAt,

    receivedBy: record.receivedByUser,
    receivedDate: record.updatedAt,

    registrar: record.registrar,

    registryNumber: record.registryNumber,
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <>
      {/* ====================================================== */}
      {/* NORMAL SCREEN PAGE */}
      {/* ====================================================== */}

      <div className="screen-only space-y-6">
        {/* ==================================================== */}
        {/* HEADER */}
        {/* ==================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92191d]">
              Civil Registry Record
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Birth Certificate Record
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View the registered birth certificate information.
            </p>
          </div>

          {/* ================================================== */}
          {/* ACTIONS */}
          {/* ================================================== */}

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
            >
              <Link href="/clerk/records">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Records
              </Link>
            </Button>

            <Button
              type="button"
              onClick={handlePrint}
              className="bg-[#92191d] text-white hover:bg-[#7a1518]"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Certificate
            </Button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* SCREEN CERTIFICATE */}
        {/* ==================================================== */}

        <Card className="overflow-hidden p-5">
          <BirthCertificatePreview
            {...certificateProps}
            previewMode="record"
          />
        </Card>
      </div>

      {/* ====================================================== */}
      {/* PRINT CERTIFICATE */}
      {/* ====================================================== */}

      <div id="print-root">
        <div className="birth-print-sheet">
          <BirthCertificatePreview
            {...certificateProps}
            previewMode="print"
          />
        </div>
      </div>
    </>
  );
}