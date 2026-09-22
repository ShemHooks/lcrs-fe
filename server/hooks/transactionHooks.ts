"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getRegistrarBirthRegistrations,
  RegistrarRegistrationStatus,
} from "../api/transactionApi";

// ============================================================
// REGISTRAR BIRTH REGISTRATION QUERY KEYS
// ============================================================

export const registrarBirthRegistrationKeys = {
  all: ["registrar-birth-registrations"] as const,

  list: (registrationStatus?: RegistrarRegistrationStatus) =>
    [
      ...registrarBirthRegistrationKeys.all,
      "list",
      registrationStatus ?? "All",
    ] as const,
};

// ============================================================
// GET REGISTRAR BIRTH REGISTRATIONS
// ============================================================

export const useRegistrarBirthRegistrations = (
  registrationStatus?: RegistrarRegistrationStatus,
) => {
  return useQuery({
    queryKey: registrarBirthRegistrationKeys.list(registrationStatus),

    queryFn: () => getRegistrarBirthRegistrations(registrationStatus),

    staleTime: 1000 * 60,
  });
};
