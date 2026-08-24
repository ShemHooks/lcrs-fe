"use client";

import React from "react";
import { Settings, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SettingsPageProps {
  /** Page title */
  title?: string;
  /** Page subtitle/description */
  description?: string;
  /** The settings cards content */
  children: React.ReactNode;
  /** Optional back button URL */
  backUrl?: string;
  /** Custom className */
  className?: string;
}

export default function SettingsPage({
  title = "Settings",
  description,
  children,
  backUrl,
  className,
}: SettingsPageProps) {
  const router = useRouter();

  return (
    <div className={cn("min-h-screen bg-gray-50/50", className)}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          {/* Back button */}
          {backUrl && (
            <button
              onClick={() => router.push(backUrl)}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-900 transition-colors mb-4 group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back</span>
            </button>
          )}

          {/* Title section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-900 to-red-950 shadow-lg shadow-red-900/20">
              <Settings size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8" />

        {/* Cards Container */}
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
}
