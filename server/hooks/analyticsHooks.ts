"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getAdminAnalytics,
  getClerkAnalytics,
  getReviewerAnalytics,
  getSharedAnalytics,
  getDashboardAnalytics,
  getResidencyReports,
  searchNationality,
  getReportsBundle,
} from "../api/Analytics";

export const analyticsKeys = {
  all: ["analytics"] as const,

  admin: (year?: number) => [...analyticsKeys.all, "admin", year ?? null] as const,

  clerk: (year?: number) => [...analyticsKeys.all, "clerk", year ?? null] as const,

  reviewer: (year?: number) =>
    [...analyticsKeys.all, "reviewer", year ?? null] as const,

  shared: (year?: number) => [...analyticsKeys.all, "shared", year ?? null] as const,

  dashboard: (year?: number) =>
    [...analyticsKeys.all, "dashboard", year ?? null] as const,

  residency: (year?: number) =>
    [...analyticsKeys.all, "reports", "residency", year ?? null] as const,

  nationality: (query: string, year?: number) =>
    [
      ...analyticsKeys.all,
      "reports",
      "nationality",
      query || "",
      year ?? null,
    ] as const,

  reportsBundle: (year?: number) =>
    [...analyticsKeys.all, "reports", "bundle", year ?? null] as const,
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

export const useDashboardAnalytics = (year?: number) => {
  return useQuery({
    queryKey: analyticsKeys.dashboard(year),
    queryFn: () => getDashboardAnalytics(year),

    staleTime: 1000 * 60 * 2,

    refetchOnWindowFocus: true,

    retry: 1,
  });
};

export const useResidencyReports = (year?: number) => {
  return useQuery({
    queryKey: analyticsKeys.residency(year),
    queryFn: () => getResidencyReports(year),

    staleTime: 1000 * 60 * 2,

    refetchOnWindowFocus: true,

    retry: 1,
  });
};

/**
 * Debounced nationality search. Pass a trimmed query; an empty query
 * disables the request (the report renders its empty state instead).
 */
export const useNationalitySearch = (query: string, year?: number) => {
  const trimmed = query.trim();

  return useQuery({
    queryKey: analyticsKeys.nationality(trimmed, year),
    queryFn: () => searchNationality(trimmed, year),

    enabled: trimmed.length > 0,

    staleTime: 1000 * 30,

    refetchOnWindowFocus: false,

    retry: 1,
  });
};

export const useReportsBundle = (year?: number) => {
  return useQuery({
    queryKey: analyticsKeys.reportsBundle(year),
    queryFn: () => getReportsBundle(year),

    staleTime: 1000 * 60 * 2,

    refetchOnWindowFocus: true,

    retry: 1,
  });
};
