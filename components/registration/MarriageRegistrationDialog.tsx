"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import MarriageRegistrationForm from "../reusable/MarriageRegistrationForm";
import { MarriageRegistrationData } from "@/lib/types/marriage-registration";
import { initialMarriageRegistrationData } from "@/lib/constants/initial-marriage-registration";
import { useCreateMarriageRegistration } from "@/server/hooks/marriageCertificateHooks";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface MarriageRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MarriageRegistrationDialog = ({
  open,
  onOpenChange,
}: MarriageRegistrationDialogProps) => {
  const [formData, setFormData] = useState<MarriageRegistrationData>(
    initialMarriageRegistrationData,
  );

  const mutation = useCreateMarriageRegistration();

  const handleSubmit = () => {
    mutation.mutate(formData, {
      onSuccess: (response) => {
        toast.success(
          response?.message ?? "Marriage registration submitted successfully.",
        );
        setFormData(initialMarriageRegistrationData);
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error("Marriage registration submission failed.", {
          description:
            error?.message ?? "Unable to submit the marriage registration.",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Marriage Registration</DialogTitle>
        </DialogHeader>

        <MarriageRegistrationForm formData={formData} setFormData={setFormData} />

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-[#92191d] text-white hover:bg-[#761216]"
          >
            {mutation.isPending ? "Submitting…" : "Submit Registration"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarriageRegistrationDialog;
