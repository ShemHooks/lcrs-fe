"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createMarriageRegistration,
  getMarriageRegistrations,
  getMarriageRegistrationById,
} from "@/server/api/MarriageCertificate";
import { MarriageRegistrationData } from "@/lib/types/marriage-registration";

export const marriageRegistrationKeys = {
  all: ["marriage-registrations"] as const,
  list: () => [...marriageRegistrationKeys.all, "list"] as const,
  detail: (id: string) => [...marriageRegistrationKeys.all, "detail", id] as const,
};

export const useCreateMarriageRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MarriageRegistrationData) =>
      createMarriageRegistration(payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: marriageRegistrationKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });
};

export const useMarriageRegistrations = () => {
  return useQuery({
    queryKey: marriageRegistrationKeys.list(),
    queryFn: getMarriageRegistrations,
    staleTime: 1000 * 60,
  });
};

export const useMarriageRegistration = (id: string) => {
  return useQuery({
    queryKey: marriageRegistrationKeys.detail(id),
    queryFn: () => getMarriageRegistrationById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
};
