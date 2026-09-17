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

export const ReviewerMenu = [
  {
    name: "Dashboard",
    path: "/reviewer/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Jobs",
    path: "/reviewer/jobs",
    icon: ClipboardList,
  },
  {
    name: "Records",
    path: "/reviewer/records",
    icon: Archive,
  },

  {
    name: "Analytics",
    path: "/reviewer/analytics",
    icon: BarChart3,
  },

  {
    name: "Settings",
    path: "/reviewer/settings",
    icon: Settings,
  },
];
