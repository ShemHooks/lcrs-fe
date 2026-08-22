"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createDeathRegistration,
  getDeathRegistrations,
  getDeathRegistrationById,
} from "@/server/api/DeathCertificate";
import { DeathRegistrationData } from "@/lib/types/death-registration";

export const deathRegistrationKeys = {
  all: ["death-registrations"] as const,
  list: () => [...deathRegistrationKeys.all, "list"] as const,
  detail: (id: string) => [...deathRegistrationKeys.all, "detail", id] as const,
};

export const useCreateDeathRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeathRegistrationData) =>
      createDeathRegistration(payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: deathRegistrationKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });
};

export const useDeathRegistrations = () => {
  return useQuery({
    queryKey: deathRegistrationKeys.list(),
    queryFn: getDeathRegistrations,
    staleTime: 1000 * 60,
  });
};

export const useDeathRegistration = (id: string) => {
  return useQuery({
    queryKey: deathRegistrationKeys.detail(id),
    queryFn: () => getDeathRegistrationById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
};
