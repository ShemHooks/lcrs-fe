import api from "../config/api";

// ============================================================
// REGISTRAR BIRTH REGISTRATION TYPES
// ============================================================

export type RegistrarRegistrationStatus = "Pending" | "Registered";

export interface RegistrarUser {
  id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  position?: string | null;
}

export interface RegistrarBirthChild {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  gender?: string;
  birthDate?: string;
  placeOfBirth?: string;
  hospitalName?: string;
}

export interface RegistrarBirthRegistration {
  id: string;
  registryNumber: string | null;
  registrarId: string | null;
  preparedById: string | null;
  receivedById: string | null;

  createdAt: string;
  updatedAt: string;

  child?: RegistrarBirthChild | null;

  preparedByUser?: RegistrarUser | null;
  receivedByUser?: RegistrarUser | null;
  registrar?: RegistrarUser | null;
}

export interface RegistrarBirthJob {
  transactionId: string;
  certificateId: string;

  type: "Birth";
  status: "Approved";

  reviewComment: string | null;
  reviewedAt: string | null;
  submittedAt: string;

  childName: string;

  clerk: RegistrarUser | null;
  reviewer: RegistrarUser | null;

  birthRegistration: RegistrarBirthRegistration;
}

export interface RegistrarBirthRegistrationsResponse {
  success: boolean;
  count: number;
  data: RegistrarBirthJob[];
}

// ============================================================
// GET REGISTRAR BIRTH REGISTRATIONS
// ============================================================

export const getRegistrarBirthRegistrations = async (
  registrationStatus?: RegistrarRegistrationStatus,
): Promise<RegistrarBirthRegistrationsResponse> => {
  try {
    const response = await api.get<RegistrarBirthRegistrationsResponse>(
      "/api/transactions/registrar/birth",
      {
        params: registrationStatus
          ? {
              registrationStatus,
            }
          : undefined,
      },
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to load registrar birth registrations.",
    );
  }
};
