"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { RecordType } from "@/app/clerk/records/page";

interface RecordsControlProps {
  recordType: RecordType;
  search: string;

  onRecordTypeChange: (value: RecordType) => void;

  onSearchChange: (value: string) => void;
}

export default function RecordsControl({
  recordType,
  search,
  onRecordTypeChange,
  onSearchChange,
}: RecordsControlProps) {
  return (
    <Card className="rounded-xl border border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-[#92191d]">
            <SlidersHorizontal className="h-5 w-5" />
          </div>

          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Search Civil Registry Records
            </CardTitle>

            <p className="mt-1 text-sm text-slate-500">
              Filter and search birth, death, and marriage records.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid gap-5 md:grid-cols-[220px_1fr]">
          <div className="space-y-2">
            <Label
              htmlFor="record-type"
              className="text-sm font-medium text-slate-700"
            >
              Record Type
            </Label>

            <select
              id="record-type"
              value={recordType}
              onChange={(event) =>
                onRecordTypeChange(event.target.value as RecordType)
              }
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#92191d] focus:ring-2 focus:ring-red-100"
            >
              <option value="all">All Records</option>

              <option value="birth">Birth Records</option>

              <option value="death">Death Records</option>

              <option value="marriage">Marriage Records</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="record-search"
              className="text-sm font-medium text-slate-700"
            >
              Search Records
            </Label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                id="record-search"
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search by name or registry number"
                className="h-10 pl-10"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-sm text-blue-800">
            Use the record type filter together with a name or registry number
            to narrow down results.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
