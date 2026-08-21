"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import BirthCertificatePreview from "@/components/reusable/BirthCertificatePreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useBirthRegistration } from "@/server/hooks/birthcertificateHooks";
import { mapBirthRecordToFormData } from "@/lib/mappers/birthRegistrationMapper";

export default function BirthRecordViewPage() {
  const params = useParams<{ id: string }>();

  const id = params.id;

  const { data, isLoading, isError, error } = useBirthRegistration(id);

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

  if (!data?.data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="p-6 text-center">
          <p className="font-semibold text-slate-900">Birth record not found</p>

          <Button asChild variant="outline" className="mt-4">
            <Link href="/clerk/records">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Records
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const previewData = mapBirthRecordToFormData(data.data);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
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

        <Button asChild variant="outline">
          <Link href="/clerk/records">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Records
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden p-5">
        <BirthCertificatePreview childData={previewData} previewMode="record" />
      </Card>
    </div>
  );
}
