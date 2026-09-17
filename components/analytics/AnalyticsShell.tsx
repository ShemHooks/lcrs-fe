"use client";

import { Loader2, RefreshCcw } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AnalyticsShellProps {
  eyebrow: string;
  title: string;
  description: string;
  year: number;
  onYearChange: (year: number) => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry: () => void;
  children: React.ReactNode;
}

const YEARS = [2024, 2025, 2026, 2027];

/**
 * Common layout wrapper for the role-based analytics pages:
 * header, year filter, refresh, loading skeleton and error card.
 */
export default function AnalyticsShell({
  eyebrow,
  title,
  description,
  year,
  onYearChange,
  isLoading,
  isFetching,
  isError,
  error,
  onRetry,
  children,
}: AnalyticsShellProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92191d]">
            {eyebrow}
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={String(year)}
            onValueChange={(value) => onYearChange(Number(value))}
          >
            <SelectTrigger className="w-28 bg-white">
              <SelectValue placeholder="Year" />
            </SelectTrigger>

            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            disabled={isFetching}
            onClick={onRetry}
          >
            {isFetching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="h-32 animate-pulse bg-slate-50" />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="h-64 animate-pulse bg-slate-50" />

            <Card className="h-64 animate-pulse bg-slate-50" />
          </div>
        </div>
      ) : isError ? (
        <Card className="p-8 text-center">
          <h2 className="font-semibold text-slate-900">
            Unable to load analytics
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading analytics data."}
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            disabled={isFetching}
            onClick={onRetry}
          >
            Try Again
          </Button>
        </Card>
      ) : (
        children
      )}
    </div>
  );
}
