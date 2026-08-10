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

// create birth

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

// retrieval of birth

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
