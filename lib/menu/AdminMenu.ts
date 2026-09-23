import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Archive,
  BarChart3,
  Download,
  ClipboardList,
} from "lucide-react";

export const adminMenu = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  // {
  //   name: "Registration",
  //   path: "/admin/registration",
  //   icon: FileText,
  // },
  {
    name: "Jobs",
    path: "/admin/jobs",
    icon: ClipboardList,
  },
  {
    name: "Records",
    path: "/admin/records",
    icon: Archive,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: Download,
  },
  // {
  //   name: "Forms",
  //   path: "/admin/forms",
  //   icon: Download,
  // },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];
