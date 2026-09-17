"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getAdminAnalytics,
  getClerkAnalytics,
  getReviewerAnalytics,
  getSharedAnalytics,
} from "../api/Analytics";

export const analyticsKeys = {
  all: ["analytics"] as const,

  admin: (year?: number) => [...analyticsKeys.all, "admin", year ?? null] as const,

  clerk: (year?: number) => [...analyticsKeys.all, "clerk", year ?? null] as const,

  reviewer: (year?: number) =>
    [...analyticsKeys.all, "reviewer", year ?? null] as const,

  shared: (year?: number) => [...analyticsKeys.all, "shared", year ?? null] as const,
};

export const useAdminAnalytics = (year?: number) => {
  return useQuery({
    queryKey: analyticsKeys.admin(year),
    queryFn: () => getAdminAnalytics(year),

    staleTime: 1000 * 60 * 2,

    refetchOnWindowFocus: true,

    retry: 1,
  });
};

export const useClerkAnalytics = (year?: number) => {
  return useQuery({
    queryKey: analyticsKeys.clerk(year),
    queryFn: () => getClerkAnalytics(year),

    staleTime: 1000 * 60 * 2,

    refetchOnWindowFocus: true,

    retry: 1,
  });
};

export const useReviewerAnalytics = (year?: number) => {
  return useQuery({
    queryKey: analyticsKeys.reviewer(year),
    queryFn: () => getReviewerAnalytics(year),

    staleTime: 1000 * 60 * 2,

    refetchOnWindowFocus: true,

    retry: 1,
  });
};

export const useSharedAnalytics = (year?: number) => {
  return useQuery({
    queryKey: analyticsKeys.shared(year),
    queryFn: () => getSharedAnalytics(year),

    staleTime: 1000 * 60 * 2,

    refetchOnWindowFocus: true,

    retry: 1,
  });
};
