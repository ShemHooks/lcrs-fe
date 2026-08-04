"use client";

import { AlertCircle, FileCheck, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RegistrationActionBarProps {
  isPending: boolean;
  hasUnsavedChanges: boolean;
  errorMessage?: string;
  lastSaved?: Date | null;
  onReset: () => void;
  onSaveDraft: () => void;
  onReview: () => void;
}

const RegistrationActionBar = ({
  isPending,
  hasUnsavedChanges,
  errorMessage,
  lastSaved,
  onReset,
  onSaveDraft,
  onReview,
}: RegistrationActionBarProps) => {
  return (
    <div className="sticky bottom-0 z-30 border-t bg-white/95 px-5 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] backdrop-blur">
      {errorMessage && (
        <div
          role="alert"
          className="mb-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          <p
            className={
              hasUnsavedChanges
                ? "font-medium text-amber-700"
                : "font-medium text-emerald-700"
            }
          >
            {hasUnsavedChanges ? "Unsaved changes" : "Draft saved"}
          </p>

          {lastSaved && (
            <p className="text-xs text-slate-500">
              Last saved at{" "}
              {lastSaved.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={onReset}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Clear
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isPending || !hasUnsavedChanges}
            onClick={onSaveDraft}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>

          <Button
            type="button"
            disabled={isPending}
            onClick={onReview}
            className="bg-[#92191d] text-white hover:bg-[#761216]"
          >
            <FileCheck className="mr-2 h-4 w-4" />
            Review Registration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationActionBar;
