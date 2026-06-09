"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
        <div className="mb-6 flex justify-center">
          <ShieldAlert className="h-16 w-16 text-destructive" />
        </div>

        <h1 className="mb-2 text-3xl font-bold">403</h1>

        <h2 className="mb-3 text-xl font-semibold">Unauthorized Access</h2>

        <p className="mb-6 text-muted-foreground">
          You do not have permission to access this page. Please contact your
          administrator if you believe this is a mistake.
        </p>

        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground transition hover:opacity-90"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    </div>
  );
}
