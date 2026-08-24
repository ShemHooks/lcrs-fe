"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Bell, Users, Shield } from "lucide-react";
import SettingsPage from "@/components/reusable/SettingsPage";
import SettingsCard from "@/components/reusable/SettingsCard";

const settingsItems = [
  {
    icon: User,
    title: "My Profile",
    description: "Manage your personal information, avatar, and account details",
    href: "/admin/settings/profile",
  },
  {
    icon: Lock,
    title: "Password & Security",
    description: "Update your password and configure two-factor authentication",
    href: "/admin/settings/password&security",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Control how and when you receive notifications",
    href: "/admin/settings/notifications",
  },
  {
    icon: Users,
    title: "User Management",
    description: "Manage user accounts and permissions across the system",
    href: "/admin/users",
  },
  {
    icon: Shield,
    title: "System Settings",
    description: "Configure system-wide settings and preferences",
    href: "/admin/settings/system",
  },
];

export default function AdminSettingsPage() {
  return (
    <SettingsPage
      title="Account Settings"
      description="Manage your account preferences and security"
    >
      {settingsItems.map((item) => (
        <SettingsCard
          key={item.title}
          icon={item.icon}
          title={item.title}
          description={item.description}
          href={item.href}
        />
      ))}
    </SettingsPage>
  );
}
