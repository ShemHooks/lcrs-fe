"use client";
import CertificateRegistrationLayout from "@/components/layout/CertificateRegistrationLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CertificateRegistrationLayout>{children}</CertificateRegistrationLayout>
  );
}
