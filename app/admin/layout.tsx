"use client";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuthGuard } from "@/lib/security/Guard";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuthGuard();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking authorization...
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
