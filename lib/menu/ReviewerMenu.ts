import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Archive,
  BarChart3,
  Download,
} from "lucide-react";

export const ReviewerMenu = [
  {
    name: "Dashboard",
    path: "/reviewer/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Jobs",
    path: "/reviewer/jobs",
    icon: FileText,
  },
  {
    name: "Records",
    path: "/reviewer/records",
    icon: Archive,
  },

  {
    name: "Analytics",
    path: "",
    icon: BarChart3,
  },

  {
    name: "Settings",
    path: "/reviewer/settings",
    icon: Settings,
  },
];
