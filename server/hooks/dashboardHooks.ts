"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getDashboardStats,
  getReviewerDashboardStats,
  getAdminDashboardStats,
} from "../api/Dashboard";

// ============================================================
// QUERY KEYS
// ============================================================

export const dashboardKeys = {
  all: ["dashboard"] as const,

  clerk: () => [...dashboardKeys.all, "clerk"] as const,

  reviewer: () => [...dashboardKeys.all, "reviewer"] as const,

  admin: () => [...dashboardKeys.all, "admin"] as const,
};

// ============================================================
// CLERK DASHBOARD
// ============================================================

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.clerk(),

    queryFn: getDashboardStats,

    staleTime: 1000 * 60 * 2,

    refetchOnWindowFocus: true,

    retry: 1,
  });
};

// ============================================================
// REVIEWER DASHBOARD
// ============================================================

export const useReviewerDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.reviewer(),

    queryFn: getReviewerDashboardStats,

    staleTime: 1000 * 60,

    refetchOnWindowFocus: true,

    retry: 1,
  });
};

// ============================================================
// ADMIN / REGISTRAR DASHBOARD
// ============================================================

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.admin(),

    queryFn: getAdminDashboardStats,

    staleTime: 1000 * 60,

    refetchOnWindowFocus: true,

    retry: 1,
  });
};
