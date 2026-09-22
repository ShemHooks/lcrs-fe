"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import {
  createBirthRegistration,
  getBirthRegistrations,
  getBirthRegistrationById,
  updateBirthRegistration,
  approveBirthRegistration,
  registerBirthCertificate
} from "@/server/api/BirthCertificate";

import { BirthRegistrationData } from "@/lib/types/birth-registration";

export const birthRegistrationKeys = {
  all: ["birth-registrations"] as const,

  list: () => [...birthRegistrationKeys.all, "list"] as const,

  detail: (id: string) => [...birthRegistrationKeys.all, "detail", id] as const,
};

// ============================================================
// CREATE
// ============================================================

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

// ============================================================
// UPDATE + RESUBMIT
// ============================================================

interface UpdateBirthRegistrationVariables {
  id: string;
  payload: BirthRegistrationData;
}

export const useUpdateBirthRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateBirthRegistrationVariables) =>
      updateBirthRegistration(id, payload),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        // Current certificate
        queryClient.invalidateQueries({
          queryKey: birthRegistrationKeys.detail(variables.id),
        }),

        // Any birth-registration lists
        queryClient.invalidateQueries({
          queryKey: birthRegistrationKeys.all,
        }),

        // Clerk jobs because Returned -> Pending
        queryClient.invalidateQueries({
          queryKey: ["clerk-jobs"],
        }),

        // Reviewer transaction lists/dashboard
        queryClient.invalidateQueries({
          queryKey: ["transactions"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });
};

// ============================================================
// GET ALL
// ============================================================

export const useBirthRegistrations = () => {
  return useQuery({
    queryKey: birthRegistrationKeys.list(),
    queryFn: getBirthRegistrations,
    staleTime: 1000 * 60,
  });
};

// ============================================================
// GET BY ID
// ============================================================

export const useBirthRegistration = (id: string) => {
  return useQuery({
    queryKey: birthRegistrationKeys.detail(id),
    queryFn: () => getBirthRegistrationById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
};

// ============================================================
// APPROVE BIRTH REGISTRATION
// ============================================================

interface ApproveBirthRegistrationVariables {
  certificateId: string;
  comment?: string;
}

export const useApproveBirthRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      certificateId,
      comment,
    }: ApproveBirthRegistrationVariables) =>
      approveBirthRegistration(certificateId, comment),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        // Updated certificate because receivedById changed
        queryClient.invalidateQueries({
          queryKey: birthRegistrationKeys.detail(variables.certificateId),
        }),

        // Birth registration lists
        queryClient.invalidateQueries({
          queryKey: birthRegistrationKeys.all,
        }),

        // Reviewer queue / transaction data
        queryClient.invalidateQueries({
          queryKey: ["transactions"],
        }),

        // Reviewer dashboard
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),

        // Clerk's job becomes Approved
        queryClient.invalidateQueries({
          queryKey: ["clerk-jobs"],
        }),
      ]);
    },
  });
};


// ============================================================
// REGISTER BIRTH CERTIFICATE
// ============================================================

interface RegisterBirthCertificateVariables {
  certificateId: string;
  registryNumber: string;
}

export const useRegisterBirthCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      certificateId,
      registryNumber,
    }: RegisterBirthCertificateVariables) =>
      registerBirthCertificate(
        certificateId,
        registryNumber,
      ),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        // Certificate now has registryNumber + registrarId
        queryClient.invalidateQueries({
          queryKey: birthRegistrationKeys.detail(
            variables.certificateId,
          ),
        }),

        // General birth-registration lists
        queryClient.invalidateQueries({
          queryKey: birthRegistrationKeys.all,
        }),

        // Registrar/Admin approved Birth queue
        queryClient.invalidateQueries({
          queryKey: [
            "registrar-birth-registrations",
          ],
        }),

        // Transaction-derived data
        queryClient.invalidateQueries({
          queryKey: ["transactions"],
        }),

        // Admin dashboard
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });
};