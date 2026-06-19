import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Archive,
  BarChart3,
  Download,
} from "lucide-react";

export const clerkMenu = [
  {
    name: "Dashboard",
    path: "/clerk/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Registration",
    path: "/clerk/registration",
    icon: FileText,
  },
  {
    name: "Records",
    path: "/clerk/records",
    icon: Archive,
  },

  {
    name: "Analytics",
    path: "/clerk/analytics",
    icon: BarChart3,
  },
  {
    name: "Forms",
    path: "/clerk/forms",
    icon: Download,
  },
  {
    name: "Settings",
    path: "/clerk/settings",
    icon: Settings,
  },
];
