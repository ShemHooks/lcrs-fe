"use client";

import { BirthRegistrationData } from "@/lib/types/birth-registration";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BirthRegistrationReviewDialogProps {
  open: boolean;
  data: BirthRegistrationData;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const BirthRegistrationReviewDialog = ({
  open,
  data,
  isPending,
  onOpenChange,
  onConfirm,
}: BirthRegistrationReviewDialogProps) => {
  const childName = [
    data.childFirstName,
    data.childMiddleName,
    data.childLastName,
  ]
    .filter(Boolean)
    .join(" ");

  const placeOfBirth = [
    data.placeOfBirth.barangayName,
    data.placeOfBirth.cityName,
    data.placeOfBirth.provinceName,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Review birth registration</AlertDialogTitle>

          <AlertDialogDescription>
            Verify the important information before submitting the record.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <ReviewItem label="Child's name" value={childName} />
          <ReviewItem label="Sex" value={data.gender} />
          <ReviewItem label="Date of birth" value={data.childBirthDate} />
          <ReviewItem label="Place of birth" value={placeOfBirth} />
          <ReviewItem
            label="Mother"
            value={[
              data.motherFirstName,
              data.motherMiddleName,
              data.motherLastName,
            ]
              .filter(Boolean)
              .join(" ")}
          />
          <ReviewItem
            label="Father"
            value={[
              data.fatherFirstName,
              data.fatherMiddleName,
              data.fatherLastName,
            ]
              .filter(Boolean)
              .join(" ")}
          />
          <ReviewItem label="Informant" value={data.informantName} />
          <ReviewItem label="Attendant" value={data.attendantName} />
        </div>

        <p className="text-sm text-amber-700">
          Submitting will create a permanent civil registry record.
        </p>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Return to form
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            className="bg-[#92191d] hover:bg-[#761216]"
          >
            {isPending ? "Submitting..." : "Confirm and Submit"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface ReviewItemProps {
  label: string;
  value?: string;
}

const ReviewItem = ({ label, value }: ReviewItemProps) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-1 font-medium text-slate-900">{value || "Not provided"}</p>
  </div>
);

export default BirthRegistrationReviewDialog;
