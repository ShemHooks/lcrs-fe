"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import MarriageRegistrationForm from "@/components/reusable/MarriageRegistrationForm";
import RegistrationActionBar from "@/components/registration/RegistrationActionBar";

import { MarriageRegistrationData } from "@/lib/types/marriage-registration";
import { initialMarriageRegistrationData } from "@/lib/constants/initial-marriage-registration";

import { useCreateMarriageRegistration } from "@/server/hooks/marriageCertificateHooks";

const DRAFT_KEY = "marriage-registration-draft";

type PageMode = "edit" | "review";

export default function Page() {
  const [mode, setMode] = useState<PageMode>("edit");

  const [formData, setFormData] = useState<MarriageRegistrationData>(
    initialMarriageRegistrationData,
  );

  const [savedSnapshot, setSavedSnapshot] = useState(
    JSON.stringify(initialMarriageRegistrationData),
  );

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  /**
   * TanStack Query mutation
   */
  const mutation = useCreateMarriageRegistration();

  /**
   * Detect unsaved changes
   */
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(formData) !== savedSnapshot;
  }, [formData, savedSnapshot]);

  /**
   * Form validation
   */
  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    if (!formData.groomFirstName.trim()) {
      errors.push("Groom's first name is required.");
    }

    if (!formData.groomLastName.trim()) {
      errors.push("Groom's last name is required.");
    }

    if (!formData.brideFirstName.trim()) {
      errors.push("Bride's first name is required.");
    }

    if (!formData.brideLastName.trim()) {
      errors.push("Bride's last name is required.");
    }

    if (!formData.dateOfMarriage) {
      errors.push("Date of marriage is required.");
    }

    if (!formData.placeOfMarriage.trim()) {
      errors.push("Place of marriage is required.");
    }

    if (!formData.solemnizingOfficerName.trim()) {
      errors.push("Solemnizing officer's name is required.");
    }

    return errors;
  }, [formData]);

  const isFormValid = validationErrors.length === 0;

  /**
   * Restore draft when page loads
   */
  useEffect(() => {
    const savedDraft = sessionStorage.getItem(DRAFT_KEY);

    if (!savedDraft) return;

    try {
      const parsedDraft = JSON.parse(savedDraft) as {
        data: MarriageRegistrationData;
        savedAt: string;
      };

      setFormData(parsedDraft.data);

      setSavedSnapshot(JSON.stringify(parsedDraft.data));

      setLastSaved(new Date(parsedDraft.savedAt));

      toast.info("Your saved marriage registration draft was restored.");
    } catch {
      sessionStorage.removeItem(DRAFT_KEY);

      toast.error("The saved draft could not be restored.");
    }
  }, []);

  /**
   * Save draft
   */
  const saveDraft = () => {
    try {
      const savedAt = new Date();

      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          data: formData,
          savedAt: savedAt.toISOString(),
        }),
      );

      setSavedSnapshot(JSON.stringify(formData));

      setLastSaved(savedAt);

      toast.success("Draft saved successfully.");
    } catch {
      toast.error("Unable to save the draft.");
    }
  };

  /**
   * Open review mode
   */
  const openReview = () => {
    setMode("review");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /**
   * Back to edit mode
   */
  const backToEdit = () => {
    setMode("edit");

    mutation.reset();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /**
   * Submit registration
   */
  const submitRegistration = () => {
    if (!isFormValid) {
      toast.error("Complete all required fields before submitting.");
      return;
    }

    mutation.mutate(formData, {
      onSuccess: (response) => {
        sessionStorage.removeItem(DRAFT_KEY);

        setFormData(initialMarriageRegistrationData);

        setSavedSnapshot(JSON.stringify(initialMarriageRegistrationData));

        setLastSaved(null);

        setMode("edit");

        toast.success(
          response?.message ?? "Marriage registration submitted successfully.",
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      },

      onError: (error: any) => {
        const message =
          error?.message ??
          error?.response?.data?.message ??
          "Unable to submit the marriage registration.";

        toast.error("Marriage registration submission failed.", {
          description: message,
        });
      },
    });
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    const confirmed = window.confirm(
      "Clear all entered marriage registration information?",
    );

    if (!confirmed) return;

    sessionStorage.removeItem(DRAFT_KEY);

    setFormData(initialMarriageRegistrationData);

    setSavedSnapshot(JSON.stringify(initialMarriageRegistrationData));

    setLastSaved(null);

    setMode("edit");

    mutation.reset();

    toast.success("The marriage registration form has been cleared.");
  };

  /**
   * Get mutation error message
   */
  const submissionError = mutation.isError
    ? mutation.error instanceof Error
      ? mutation.error.message
      : "Unable to submit the marriage registration."
    : undefined;

  /**
   * =========================
   * REVIEW MODE
   * =========================
   */
  if (mode === "review") {
    return (
      <div className="flex min-h-full flex-col pb-28">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92191d]">
              Certificate of Marriage
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Marriage Registration — Review
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Please review the information below before submitting.
            </p>
          </div>
        </div>

        {/* Review content — simplified summary */}
        <div className="w-full">
          <div className="rounded-sm border bg-white p-6">
            <h2 className="mb-4 text-lg font-bold">Marriage Registration Summary</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Groom */}
              <div>
                <h3 className="mb-2 font-semibold uppercase text-[#92191d]">
                  Husband
                </h3>
                <p>
                  <span className="text-gray-500">Name: </span>
                  {formData.groomFirstName} {formData.groomMiddleName}{" "}
                  {formData.groomLastName}
                </p>
                <p>
                  <span className="text-gray-500">Age: </span>
                  {formData.groomAge}
                </p>
                <p>
                  <span className="text-gray-500">Citizenship: </span>
                  {formData.groomCitizenship}
                </p>
                <p>
                  <span className="text-gray-500">Religion: </span>
                  {formData.groomReligion}
                </p>
              </div>

              {/* Bride */}
              <div>
                <h3 className="mb-2 font-semibold uppercase text-[#92191d]">
                  Wife
                </h3>
                <p>
                  <span className="text-gray-500">Name: </span>
                  {formData.brideFirstName} {formData.brideMiddleName}{" "}
                  {formData.brideLastName}
                </p>
                <p>
                  <span className="text-gray-500">Age: </span>
                  {formData.brideAge}
                </p>
                <p>
                  <span className="text-gray-500">Citizenship: </span>
                  {formData.brideCitizenship}
                </p>
                <p>
                  <span className="text-gray-500">Religion: </span>
                  {formData.brideReligion}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <p>
                <span className="text-gray-500">Date of Marriage: </span>
                {formData.dateOfMarriage}
              </p>
              <p>
                <span className="text-gray-500">Time of Marriage: </span>
                {formData.timeOfMarriage}
              </p>
              <p>
                <span className="text-gray-500">Place of Marriage: </span>
                {formData.placeOfMarriage},{" "}
                {formData.placeOfMarriageCity},{" "}
                {formData.placeOfMarriageProvince}
              </p>
              <p>
                <span className="text-gray-500">Solemnizing Officer: </span>
                {formData.solemnizingOfficerName}
              </p>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
                <p className="mb-1 text-sm font-medium text-red-700">
                  Please fix the following:
                </p>
                <ul className="list-inside list-disc text-sm text-red-600">
                  {validationErrors.map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 z-40 mt-4 border-t bg-white/95 px-5 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.07)] backdrop-blur">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={backToEdit}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Back to Edit
            </button>

            <button
              type="button"
              onClick={submitRegistration}
              disabled={mutation.isPending}
              className="rounded-md bg-[#92191d] px-4 py-2 text-sm font-medium text-white hover:bg-[#761216] disabled:opacity-50"
            >
              {mutation.isPending ? "Submitting…" : "Submit Registration"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * =========================
   * EDIT MODE
   * =========================
   */
  return (
    <div className="flex min-h-full flex-col pb-28">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92191d]">
            Certificate of Marriage
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Marriage Registration
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Encode the information exactly as provided in the supporting civil
            registry documents.
          </p>
        </div>

        <div className="hidden rounded-lg border bg-white px-4 py-3 text-right sm:block">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Step
          </p>

          <p className="font-semibold text-slate-800">1 of 2 — Encode</p>
        </div>
      </div>

      {/* Form */}
      <form
        id="marriage-registration-form"
        onSubmit={(event) => {
          event.preventDefault();
          openReview();
        }}
        className="w-full"
      >
        <MarriageRegistrationForm formData={formData} setFormData={setFormData} />
      </form>

      {/* Actions */}
      <RegistrationActionBar
        isPending={mutation.isPending}
        hasUnsavedChanges={hasUnsavedChanges}
        errorMessage={submissionError}
        lastSaved={lastSaved}
        onReset={resetForm}
        onSaveDraft={saveDraft}
        onReview={openReview}
      />
    </div>
  );
}
