"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBirthRegistration } from "@/server/api/BirthCertificate";
import { BirthRegistrationData } from "@/lib/types/birth-registration";

export const useCreateBirthRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BirthRegistrationData) =>
      createBirthRegistration(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["birth-registrations"],
      });
    },
  });
};
