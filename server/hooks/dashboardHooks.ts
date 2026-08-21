"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardStats, getReviewerDashboardStats } from "../api/Dashboard";

export const dashboardKeys = {
  all: ["dashboard"] as const,

  clerk: () => [...dashboardKeys.all, "clerk"] as const,

  reviewer: () => [...dashboardKeys.all, "reviewer"] as const,
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.clerk(),
    queryFn: getDashboardStats,

    staleTime: 1000 * 60 * 2,

    refetchOnWindowFocus: true,

    retry: 1,
  });
};

export const useReviewerDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.reviewer(),
    queryFn: getReviewerDashboardStats,

    staleTime: 1000 * 60,

    refetchOnWindowFocus: true,

    retry: 1,
  });
};
