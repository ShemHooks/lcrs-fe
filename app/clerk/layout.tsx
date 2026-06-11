"use client";
import { useAuthGuard } from "@/lib/security/Guard";
import ClerkLayout from "@/components/layout/ClerkLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuthGuard();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking authorization...
      </div>
    );
  }

  return <ClerkLayout>{children}</ClerkLayout>;
}
