"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../api/Dashboard";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,

    staleTime: 1000 * 60 * 2,

    refetchOnWindowFocus: true,

    retry: 1,
  });
};
