"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import BirthRegistrationForm from "@/components/reusable/BirthRegistrationForm";
import BirthRegistrationReview from "@/components/registration/BirthRegistrationReview";
import RegistrationActionBar from "@/components/registration/RegistrationActionBar";

import { BirthRegistrationData } from "@/lib/types/birth-registration";
import { initialBirthRegistrationData } from "@/lib/constants/initial-birth-registration";

import { useCreateBirthRegistration } from "@/server/hooks/birthcertificateHooks";

import { mapBirthFormDataToApi } from "@/lib/mappers/birthRegistrationMapper";

const DRAFT_KEY = "birth-registration-draft";

type PageMode = "edit" | "review";

export default function Page() {
  const [mode, setMode] = useState<PageMode>("edit");

  const [formData, setFormData] = useState<BirthRegistrationData>(
    initialBirthRegistrationData,
  );

  const [savedSnapshot, setSavedSnapshot] = useState(
    JSON.stringify(initialBirthRegistrationData),
  );

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  /**
   * TanStack Query mutation
   */
  const mutation = useCreateBirthRegistration();

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

    if (!formData.childFirstName.trim()) {
      errors.push("Child's first name is required.");
    }

    if (!formData.childLastName.trim()) {
      errors.push("Child's last name is required.");
    }

    if (!formData.gender) {
      errors.push("Child's sex is required.");
    }

    if (!formData.childBirthDate) {
      errors.push("Date of birth is required.");
    }

    if (!formData.placeOfBirth.cityCode) {
      errors.push("City or municipality of birth is required.");
    }

    if (!formData.motherFirstName.trim()) {
      errors.push("Mother's first name is required.");
    }

    if (!formData.motherLastName.trim()) {
      errors.push("Mother's last name is required.");
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
        data: BirthRegistrationData;
        savedAt: string;
      };

      setFormData(parsedDraft.data);

      setSavedSnapshot(JSON.stringify(parsedDraft.data));

      setLastSaved(new Date(parsedDraft.savedAt));

      toast.info("Your saved birth registration draft was restored.");
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

    const payload = mapBirthFormDataToApi(formData);

    mutation.mutate(payload, {
      onSuccess: (response) => {
        sessionStorage.removeItem(DRAFT_KEY);

        setFormData(initialBirthRegistrationData);

        setSavedSnapshot(JSON.stringify(initialBirthRegistrationData));

        setLastSaved(null);

        setMode("edit");

        toast.success(
          response?.message ?? "Birth registration submitted successfully.",
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
          "Unable to submit the birth registration.";

        toast.error("Birth registration submission failed.", {
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
      "Clear all entered birth registration information?",
    );

    if (!confirmed) return;

    sessionStorage.removeItem(DRAFT_KEY);

    setFormData(initialBirthRegistrationData);

    setSavedSnapshot(JSON.stringify(initialBirthRegistrationData));

    setLastSaved(null);

    setMode("edit");

    mutation.reset();

    toast.success("The birth registration form has been cleared.");
  };

  /**
   * Get mutation error message
   */
  const submissionError = mutation.isError
    ? mutation.error instanceof Error
      ? mutation.error.message
      : "Unable to submit the birth registration."
    : undefined;

  /**
   * =========================
   * REVIEW MODE
   * =========================
   */
  if (mode === "review") {
    return (
      <BirthRegistrationReview
        formData={formData}
        validationErrors={validationErrors}
        isFormValid={isFormValid}
        isPending={mutation.isPending}
        // errorMessage={submissionError}
        onBack={backToEdit}
        onSubmit={submitRegistration}
      />
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
            Certificate of Live Birth
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Birth Registration
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
        id="birth-registration-form"
        onSubmit={(event) => {
          event.preventDefault();
          openReview();
        }}
        className="w-full"
      >
        <BirthRegistrationForm formData={formData} setFormData={setFormData} />
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
