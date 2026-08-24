"use client";

import { useQuery } from "@tanstack/react-query";

import { getJobs, type JobsFilters } from "../api/Jobs";

export const jobsKeys = {
  all: ["jobs"] as const,
  filtered: (filters: JobsFilters) => [...jobsKeys.all, filters] as const,
};

export const useJobs = (filters?: JobsFilters) => {
  return useQuery({
    queryKey: jobsKeys.filtered(filters ?? {}),
    queryFn: () => getJobs(filters),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};
