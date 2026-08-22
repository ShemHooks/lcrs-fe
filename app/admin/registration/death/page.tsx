"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import DeathRegistrationForm from "@/components/reusable/DeathRegistrationForm";
import RegistrationActionBar from "@/components/registration/RegistrationActionBar";

import { DeathRegistrationData } from "@/lib/types/death-registration";
import { initialDeathRegistrationData } from "@/lib/constants/initial-death-registration";

import { useCreateDeathRegistration } from "@/server/hooks/deathCertificateHooks";

const DRAFT_KEY = "death-registration-draft";

type PageMode = "edit" | "review";

export default function Page() {
  const [mode, setMode] = useState<PageMode>("edit");

  const [formData, setFormData] = useState<DeathRegistrationData>(
    initialDeathRegistrationData,
  );

  const [savedSnapshot, setSavedSnapshot] = useState(
    JSON.stringify(initialDeathRegistrationData),
  );

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  /**
   * TanStack Query mutation
   */
  const mutation = useCreateDeathRegistration();

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

    if (!formData.firstName.trim()) {
      errors.push("Deceased's first name is required.");
    }

    if (!formData.lastName.trim()) {
      errors.push("Deceased's last name is required.");
    }

    if (!formData.sex) {
      errors.push("Sex is required.");
    }

    if (!formData.dateOfDeath) {
      errors.push("Date of death is required.");
    }

    if (!formData.immediateCause.trim()) {
      errors.push("Cause of death is required.");
    }

    if (!formData.informantName.trim()) {
      errors.push("Informant's name is required.");
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
        data: DeathRegistrationData;
        savedAt: string;
      };

      setFormData(parsedDraft.data);

      setSavedSnapshot(JSON.stringify(parsedDraft.data));

      setLastSaved(new Date(parsedDraft.savedAt));

      toast.info("Your saved death registration draft was restored.");
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

        setFormData(initialDeathRegistrationData);

        setSavedSnapshot(JSON.stringify(initialDeathRegistrationData));

        setLastSaved(null);

        setMode("edit");

        toast.success(
          response?.message ?? "Death registration submitted successfully.",
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
          "Unable to submit the death registration.";

        toast.error("Death registration submission failed.", {
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
      "Clear all entered death registration information?",
    );

    if (!confirmed) return;

    sessionStorage.removeItem(DRAFT_KEY);

    setFormData(initialDeathRegistrationData);

    setSavedSnapshot(JSON.stringify(initialDeathRegistrationData));

    setLastSaved(null);

    setMode("edit");

    mutation.reset();

    toast.success("The death registration form has been cleared.");
  };

  /**
   * Get mutation error message
   */
  const submissionError = mutation.isError
    ? mutation.error instanceof Error
      ? mutation.error.message
      : "Unable to submit the death registration."
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
              Certificate of Death
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Death Registration — Review
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Please review the information below before submitting.
            </p>
          </div>
        </div>

        {/* Review content — summary */}
        <div className="w-full">
          <div className="rounded-sm border bg-white p-6">
            <h2 className="mb-4 text-lg font-bold">
              Death Registration Summary
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold uppercase text-[#92191d]">
                  Deceased Information
                </h3>
                <p>
                  <span className="text-gray-500">Name: </span>
                  {formData.firstName} {formData.middleName}{" "}
                  {formData.lastName}
                </p>
                <p>
                  <span className="text-gray-500">Sex: </span>
                  {formData.sex}
                </p>
                <p>
                  <span className="text-gray-500">Date of Death: </span>
                  {formData.dateOfDeath}
                </p>
                <p>
                  <span className="text-gray-500">Date of Birth: </span>
                  {formData.dateOfBirth}
                </p>
                <p>
                  <span className="text-gray-500">Age: </span>
                  {formData.ageYears} years {formData.ageMonths} months{" "}
                  {formData.ageDays} days
                </p>
                <p>
                  <span className="text-gray-500">Place of Death: </span>
                  {formData.placeOfDeath}
                </p>
                <p>
                  <span className="text-gray-500">Cause of Death: </span>
                  {formData.immediateCause}
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-semibold uppercase text-[#92191d]">
                  Informant
                </h3>
                <p>
                  <span className="text-gray-500">Name: </span>
                  {formData.informantName}
                </p>
                <p>
                  <span className="text-gray-500">Relationship: </span>
                  {formData.informantRelationship}
                </p>
              </div>
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
            Certificate of Death
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Death Registration
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
        id="death-registration-form"
        onSubmit={(event) => {
          event.preventDefault();
          openReview();
        }}
        className="w-full"
      >
        <DeathRegistrationForm formData={formData} setFormData={setFormData} />
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
