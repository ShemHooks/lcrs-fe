"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import BirthRegistrationForm from "@/components/reusable/BirthRegistrationForm";
import BirthCertificatePreview from "@/components/reusable/BirthCertificatePreview";
import RegistrationActionBar from "@/components/registration/RegistrationActionBar";
import BirthRegistrationReviewDialog from "@/components/registration/BirthRegistrationReviewDialog";

import { BirthRegistrationData } from "@/lib/types/birth-registration";
import { initialBirthRegistrationData } from "@/lib/constants/initial-birth-registration";
import { createBirthRegistration } from "@/server/api/BirthCertificate";

const DRAFT_KEY = "birth-registration-draft";

export default function Page() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<BirthRegistrationData>(
    initialBirthRegistrationData,
  );

  const [savedSnapshot, setSavedSnapshot] = useState(
    JSON.stringify(initialBirthRegistrationData),
  );

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(formData) !== savedSnapshot,
    [formData, savedSnapshot],
  );

  const mutation = useMutation({
    mutationFn: createBirthRegistration,

    onSuccess: async (response) => {
      sessionStorage.removeItem(DRAFT_KEY);

      setFormData(initialBirthRegistrationData);
      setSavedSnapshot(JSON.stringify(initialBirthRegistrationData));
      setLastSaved(null);
      setIsReviewOpen(false);

      await queryClient.invalidateQueries({
        queryKey: ["birth-registrations"],
      });

      toast.success(
        response.message || "Birth registration submitted successfully.",
      );
    },

    onError: (error: Error) => {
      setIsReviewOpen(false);
      toast.error(error.message);
    },
  });

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

      toast.info("A saved birth registration draft was restored.");
    } catch {
      sessionStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  const validateForm = (): string[] => {
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
  };

  const openReview = () => {
    setIsReviewOpen(true);
  };

  const submitRegistration = () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setIsReviewOpen(false);
      toast.error(validationErrors[0]);
      return;
    }

    mutation.mutate(formData);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openReview();
  };

  const saveDraft = () => {
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

    toast.success("Draft saved for this browser session.");
  };

  const resetForm = () => {
    const confirmed = window.confirm(
      "Clear all entered birth registration information?",
    );

    if (!confirmed) return;

    sessionStorage.removeItem(DRAFT_KEY);

    setFormData(initialBirthRegistrationData);
    setSavedSnapshot(JSON.stringify(initialBirthRegistrationData));
    setLastSaved(null);

    mutation.reset();

    toast.success("The registration form has been cleared.");
  };

  return (
    <div className="flex min-h-full flex-col mt-2">
      <form
        id="birth-registration-form"
        onSubmit={handleFormSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.9fr)]"
      >
        <BirthRegistrationForm formData={formData} setFormData={setFormData} />

        <aside className="self-start xl:sticky xl:top-24">
          <BirthCertificatePreview childData={formData} />
        </aside>
      </form>

      <RegistrationActionBar
        isPending={mutation.isPending}
        hasUnsavedChanges={hasUnsavedChanges}
        errorMessage={mutation.isError ? mutation.error.message : undefined}
        lastSaved={lastSaved}
        onReset={resetForm}
        onSaveDraft={saveDraft}
        onReview={openReview}
      />

      <BirthRegistrationReviewDialog
        open={isReviewOpen}
        data={formData}
        isPending={mutation.isPending}
        onOpenChange={setIsReviewOpen}
        onConfirm={submitRegistration}
      />
    </div>
  );
}
