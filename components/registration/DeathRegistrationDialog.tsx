"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import DeathRegistrationForm from "../reusable/DeathRegistrationForm";
import { DeathRegistrationData } from "@/lib/types/death-registration";
import { initialDeathRegistrationData } from "@/lib/constants/initial-death-registration";
import { useCreateDeathRegistration } from "@/server/hooks/deathCertificateHooks";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface DeathRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeathRegistrationDialog = ({
  open,
  onOpenChange,
}: DeathRegistrationDialogProps) => {
  const [formData, setFormData] = useState<DeathRegistrationData>(
    initialDeathRegistrationData,
  );

  const mutation = useCreateDeathRegistration();

  const handleSubmit = () => {
    mutation.mutate(formData, {
      onSuccess: (response) => {
        toast.success(
          response?.message ?? "Death registration submitted successfully.",
        );
        setFormData(initialDeathRegistrationData);
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error("Death registration submission failed.", {
          description:
            error?.message ?? "Unable to submit the death registration.",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Death Registration</DialogTitle>
        </DialogHeader>

        <DeathRegistrationForm formData={formData} setFormData={setFormData} />

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

export default DeathRegistrationDialog;
