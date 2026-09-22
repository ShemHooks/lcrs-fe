import api from "../config/api";
import {
  BirthRegistrationData,
  BirthRegistrationRecord,
} from "@/lib/types/birth-registration";

export interface BirthRegistrationResponse {
  success: boolean;
  message: string;
  data: BirthRegistrationData & {
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface BirthRegistrationCreateResponse {
  success: boolean;
  message?: string;
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface BirthRegistrationListResponse {
  success: boolean;
  count?: number;
  data: BirthRegistrationRecord[];
}

export interface BirthRegistrationDetailResponse {
  success: boolean;
  data: BirthRegistrationRecord;
}

export interface BirthRegistrationUpdateResponse {
  success: boolean;
  message?: string;
  data: BirthRegistrationRecord;
}

export interface BirthRegistrationApproveResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    certificate_id: string;
    transaction_purpose: string;
    status: string;
    reviewer_id: string | null;
    review_comment: string | null;
    reviewed_at: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface BirthRegistrationRegisterResponse {
  success: boolean;
  message: string;
  data: BirthRegistrationRecord;
}

// ============================================================
// CREATE BIRTH REGISTRATION
// ============================================================

export const createBirthRegistration = async (
  payload: BirthRegistrationData,
): Promise<BirthRegistrationCreateResponse> => {
  try {
    const response = await api.post<BirthRegistrationCreateResponse>(
      "/api/birth_registration",
      payload,
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to submit the birth registration.",
    );
  }
};

// ============================================================
// GET ALL BIRTH REGISTRATIONS
// ============================================================

export const getBirthRegistrations =
  async (): Promise<BirthRegistrationListResponse> => {
    try {
      const response = await api.get<BirthRegistrationListResponse>(
        "/api/birth_registration",
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ??
          error.message ??
          "Unable to load birth registrations.",
      );
    }
  };

// ============================================================
// GET BIRTH REGISTRATION BY ID
// ============================================================

export const getBirthRegistrationById = async (
  id: string,
): Promise<BirthRegistrationDetailResponse> => {
  try {
    const response = await api.get<BirthRegistrationDetailResponse>(
      `/api/birth_registration/${id}`,
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to load birth registration.",
    );
  }
};

// ============================================================
// UPDATE + RESUBMIT BIRTH REGISTRATION
// ============================================================

export const updateBirthRegistration = async (
  id: string,
  payload: BirthRegistrationData,
): Promise<BirthRegistrationUpdateResponse> => {
  try {
    const response = await api.put<BirthRegistrationUpdateResponse>(
      `/api/birth_registration/${id}`,
      payload,
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to update and resubmit the birth registration.",
    );
  }
};

export const approveBirthRegistration = async (
  certificateId: string,
  comment?: string,
): Promise<BirthRegistrationApproveResponse> => {
  try {
    const response = await api.put<BirthRegistrationApproveResponse>(
      `/api/transactions/certificate/${certificateId}/approve`,
      {
        comment: comment?.trim() || null,
      },
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to approve the birth registration.",
    );
  }
};

// ============================================================
// REGISTER BIRTH CERTIFICATE
// ============================================================

export const registerBirthCertificate = async (
  certificateId: string,
  registryNumber: string,
): Promise<BirthRegistrationRegisterResponse> => {
  try {
    const response = await api.put<BirthRegistrationRegisterResponse>(
      `/api/birth_registration/${certificateId}/register`,
      {
        registryNumber: registryNumber.trim(),
      },
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to register the birth certificate.",
    );
  }
};
