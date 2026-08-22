import api from "../config/api";
import {
  DeathRegistrationData,
  DeathRegistrationRecord,
} from "@/lib/types/death-registration";

export interface DeathRegistrationCreateResponse {
  success: boolean;
  message?: string;
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface DeathRegistrationListResponse {
  success: boolean;
  count?: number;
  data: DeathRegistrationRecord[];
}

export interface DeathRegistrationDetailResponse {
  success: boolean;
  data: DeathRegistrationRecord;
}

export const createDeathRegistration = async (
  payload: DeathRegistrationData,
): Promise<DeathRegistrationCreateResponse> => {
  try {
    const response = await api.post<DeathRegistrationCreateResponse>(
      "/api/death_registration",
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to submit the death registration.",
    );
  }
};

export const getDeathRegistrations =
  async (): Promise<DeathRegistrationListResponse> => {
    try {
      const response = await api.get<DeathRegistrationListResponse>(
        "/api/death_registration",
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ??
          error.message ??
          "Unable to load death registrations.",
      );
    }
  };

export const getDeathRegistrationById = async (
  id: string,
): Promise<DeathRegistrationDetailResponse> => {
  try {
    const response = await api.get<DeathRegistrationDetailResponse>(
      `/api/death_registration/${id}`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to load death registration.",
    );
  }
};
