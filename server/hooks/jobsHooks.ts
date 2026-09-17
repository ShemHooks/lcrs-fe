"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getJobs,
  getClerkJobs,
  returnJob,
  type JobsFilters,
  type ClerkJobsFilters,
} from "../api/Jobs";

// ============================================================
// QUERY KEYS
// ============================================================

export const jobsKeys = {
  // Reviewer
  reviewer: {
    all: ["jobs", "reviewer"] as const,

    filtered: (filters: JobsFilters) => ["jobs", "reviewer", filters] as const,
  },

  // Clerk
  clerk: {
    all: ["jobs", "clerk"] as const,

    filtered: (filters: ClerkJobsFilters) =>
      ["jobs", "clerk", filters] as const,
  },
};

// ============================================================
// REVIEWER JOBS
// ============================================================

export const useJobs = (filters?: JobsFilters) => {
  return useQuery({
    queryKey: jobsKeys.reviewer.filtered(filters ?? {}),

    queryFn: () => getJobs(filters),

    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};

// ============================================================
// CLERK JOBS
// ============================================================

export const useClerkJobs = (filters?: ClerkJobsFilters) => {
  return useQuery({
    queryKey: jobsKeys.clerk.filtered(filters ?? {}),

    queryFn: () => getClerkJobs(filters),

    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};

// ============================================================
// RETURN JOB
// ============================================================

export const useReturnJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      certificateId,
      reason,
    }: {
      certificateId: string;
      reason: string;
    }) => {
      return returnJob(certificateId, reason);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobsKeys.reviewer.all,
      });

      queryClient.invalidateQueries({
        queryKey: jobsKeys.clerk.all,
      });
    },
  });
};
