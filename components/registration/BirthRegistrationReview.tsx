"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  Loader2,
  Send,
} from "lucide-react";

import { BirthRegistrationData } from "@/lib/types/birth-registration";
import BirthCertificatePreview from "@/components/reusable/BirthCertificatePreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BirthRegistrationReviewProps {
  formData: BirthRegistrationData;

  validationErrors: string[];

  isFormValid: boolean;

  isPending: boolean;

  onBack: () => void;

  onSubmit: () => void;
}

export default function BirthRegistrationReview({
  formData,
  validationErrors,
  isFormValid,
  isPending,
  onBack,
  onSubmit,
}: BirthRegistrationReviewProps) {
  const childFullName = [
    formData.childFirstName,
    formData.childMiddleName,
    formData.childLastName,
  ]
    .filter(Boolean)
    .join(" ");

  const motherFullName = [
    formData.motherFirstName,
    formData.motherMiddleName,
    formData.motherLastName,
  ]
    .filter(Boolean)
    .join(" ");

  const fatherFullName = [
    formData.fatherFirstName,
    formData.fatherMiddleName,
    formData.fatherLastName,
  ]
    .filter(Boolean)
    .join(" ");

  const placeOfBirth = [
    formData.hospitalName,
    formData.placeOfBirth.barangayName,
    formData.placeOfBirth.cityName,
    formData.placeOfBirth.provinceName,
  ]
    .filter(Boolean)
    .join(", ");

  const motherResidence = [
    formData.motherHouserOrSt,
    formData.motherResidence.barangayName,
    formData.motherResidence.cityName,
    formData.motherResidence.provinceName,
  ]
    .filter(Boolean)
    .join(", ");

  const fatherResidence = [
    formData.fatherHouseOrSt,
    formData.fatherResidence.barangayName,
    formData.fatherResidence.cityName,
    formData.fatherResidence.provinceName,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-full pb-28">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-[#92191d]" />

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92191d]">
                Pre-Submission Review
              </p>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Review Birth Registration
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Verify the encoded information against the original supporting
              documents before creating the official record.
            </p>
          </div>

          <div className="rounded-lg border bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Step
            </p>

            <p className="font-semibold text-slate-800">2 of 2 — Review</p>
          </div>
        </div>
      </div>

      {/* Validation */}
      {isFormValid ? (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

          <div>
            <p className="font-semibold text-emerald-900">
              Registration is ready for submission
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              All currently required fields have been completed. Verify the
              certificate preview before submitting.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

            <div className="flex-1">
              <p className="font-semibold text-amber-900">
                {validationErrors.length} required field
                {validationErrors.length > 1 ? "s are" : " is"} incomplete
              </p>

              <p className="mt-1 text-sm text-amber-700">
                You can review the information now, but the record cannot be
                submitted until these fields are completed.
              </p>

              <ul className="mt-3 space-y-1.5 text-sm text-amber-800">
                {validationErrors.map((error) => (
                  <li key={error} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />

                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Review */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        {/* LEFT - Summary */}
        <div className="space-y-5">
          <ReviewSection title="Child Information">
            <ReviewField label="Full Name" value={childFullName} />

            <div className="grid grid-cols-2 gap-4">
              <ReviewField label="Sex" value={formData.gender} />

              <ReviewField
                label="Date of Birth"
                value={formatDate(formData.childBirthDate)}
              />
            </div>

            <ReviewField label="Place of Birth" value={placeOfBirth} />

            <div className="grid grid-cols-3 gap-4">
              <ReviewField label="Type of Birth" value={formData.typeOfBirth} />

              <ReviewField label="Birth Order" value={formData.birthOrder} />

              <ReviewField
                label="Weight"
                value={formData.weight ? `${formData.weight} grams` : ""}
              />
            </div>
          </ReviewSection>

          <ReviewSection title="Mother's Information">
            <ReviewField label="Maiden Name" value={motherFullName} />

            <div className="grid grid-cols-2 gap-4">
              <ReviewField
                label="Citizenship"
                value={formData.motherCitizenship}
              />

              <ReviewField label="Religion" value={formData.motherReligion} />

              <ReviewField
                label="Occupation"
                value={formData.motherOccupation}
              />

              <ReviewField label="Age" value={formData.motherAge} />
            </div>

            <ReviewField label="Residence" value={motherResidence} />
          </ReviewSection>

          <ReviewSection title="Father's Information">
            <ReviewField label="Full Name" value={fatherFullName} />

            <div className="grid grid-cols-2 gap-4">
              <ReviewField
                label="Citizenship"
                value={formData.fatherCitizenship}
              />

              <ReviewField label="Religion" value={formData.fatherReligion} />

              <ReviewField
                label="Occupation"
                value={formData.fatherOccupation}
              />

              <ReviewField label="Age" value={formData.fatherAge} />
            </div>

            <ReviewField label="Residence" value={fatherResidence} />
          </ReviewSection>

          <ReviewSection title="Marriage of Parents">
            <ReviewField
              label="Date of Marriage"
              value={formatDate(formData.marriageDate)}
            />

            <ReviewField
              label="Place of Marriage"
              value={[
                formData.marriagePlace.cityName,
                formData.marriagePlace.provinceName,
              ]
                .filter(Boolean)
                .join(", ")}
            />
          </ReviewSection>

          <ReviewSection title="Attendant at Birth">
            <div className="grid grid-cols-2 gap-4">
              <ReviewField label="Type" value={formData.attendantType} />

              <ReviewField label="Name" value={formData.attendantName} />
            </div>

            <ReviewField label="Address" value={formData.attendantAddress} />

            <ReviewField label="Position" value={formData.attendantPosition} />
          </ReviewSection>

          <ReviewSection title="Informant">
            <ReviewField label="Name" value={formData.informantName} />

            <ReviewField
              label="Relationship to Child"
              value={formData.informantRelationship}
            />

            <ReviewField label="Address" value={formData.informantAddress} />
          </ReviewSection>
        </div>

        {/* RIGHT - Certificate */}
        <aside className="self-start xl:sticky xl:top-24">
          <Card className="overflow-hidden rounded-lg">
            <div className="border-b px-5 py-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-[#92191d]" />

                <h2 className="font-semibold text-slate-900">
                  Certificate Preview
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Compare the generated certificate with the original supporting
                document.
              </p>
            </div>

            <div className="p-4">
              <BirthCertificatePreview childData={formData} />
            </div>
          </Card>

          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm leading-6 text-blue-800">
              Check names, dates, addresses, birth information, and parent
              details carefully. Return to the form if any information needs to
              be corrected.
            </p>
          </div>
        </aside>
      </div>

      {/* Bottom Review Bar */}
      <div className="sticky bottom-0 z-40 mt-6 border-t bg-white/95 px-5 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.07)] backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Edit
          </Button>

          <div className="flex flex-col items-end">
            {!isFormValid && (
              <p className="mb-2 text-xs font-medium text-amber-700">
                Complete the missing required fields before submitting.
              </p>
            )}

            <Button
              type="button"
              disabled={!isFormValid || isPending}
              onClick={onSubmit}
              className="min-w-[190px] bg-[#92191d] text-white hover:bg-[#761216]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Confirm & Submit
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ReviewSectionProps {
  title: string;
  children: React.ReactNode;
}

function ReviewSection({ title, children }: ReviewSectionProps) {
  return (
    <Card className="rounded-lg p-5">
      <div className="mb-4 border-b pb-3">
        <h2 className="font-semibold text-slate-900">{title}</h2>
      </div>

      <div className="space-y-4">{children}</div>
    </Card>
  );
}

interface ReviewFieldProps {
  label: string;
  value?: string | number;
}

function ReviewField({ label, value }: ReviewFieldProps) {
  const hasValue =
    value !== undefined && value !== null && String(value).trim() !== "";

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-medium ${
          hasValue ? "text-slate-900" : "italic text-slate-400"
        }`}
      >
        {hasValue ? value : "Not provided"}
      </p>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
