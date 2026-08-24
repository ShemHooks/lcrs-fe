"use client";

import React from "react";
import { User, Lock, Bell } from "lucide-react";
import SettingsPage from "@/components/reusable/SettingsPage";
import SettingsCard from "@/components/reusable/SettingsCard";

const settingsItems = [
  {
    icon: User,
    title: "My Profile",
    description: "Manage your personal information, avatar, and account details",
    href: "/reviewer/settings/profile",
  },
  {
    icon: Lock,
    title: "Password & Security",
    description: "Update your password and configure two-factor authentication",
    href: "/reviewer/settings/password&security",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Control how and when you receive notifications",
    href: "/reviewer/settings/notifications",
  },
];

export default function ReviewerSettingsPage() {
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
