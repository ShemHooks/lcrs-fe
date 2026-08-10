"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createBirthRegistration,
  getBirthRegistrations,
  getBirthRegistrationById,
} from "@/server/api/BirthCertificate";
import { BirthRegistrationData } from "@/lib/types/birth-registration";

export const birthRegistrationKeys = {
  all: ["birth-registrations"] as const,
  list: () => [...birthRegistrationKeys.all, "list"] as const,
  detail: (id: string) => [...birthRegistrationKeys.all, "detail", id] as const,
};

export const useCreateBirthRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BirthRegistrationData) =>
      createBirthRegistration(payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: birthRegistrationKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });
};

export const useBirthRegistrations = () => {
  return useQuery({
    queryKey: birthRegistrationKeys.list(),
    queryFn: getBirthRegistrations,
    staleTime: 1000 * 60,
  });
};

export const useBirthRegistration = (id: string) => {
  return useQuery({
    queryKey: birthRegistrationKeys.detail(id),
    queryFn: () => getBirthRegistrationById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
};
