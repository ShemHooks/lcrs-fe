import api from "../config/api";
import {
  MarriageRegistrationData,
  MarriageRegistrationRecord,
} from "@/lib/types/marriage-registration";

export interface MarriageRegistrationCreateResponse {
  success: boolean;
  message?: string;
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface MarriageRegistrationListResponse {
  success: boolean;
  count?: number;
  data: MarriageRegistrationRecord[];
}

export interface MarriageRegistrationDetailResponse {
  success: boolean;
  data: MarriageRegistrationRecord;
}

export const createMarriageRegistration = async (
  payload: MarriageRegistrationData,
): Promise<MarriageRegistrationCreateResponse> => {
  try {
    const response = await api.post<MarriageRegistrationCreateResponse>(
      "/api/marriage_registration",
      payload,
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to submit the marriage registration.",
    );
  }
};

export const getMarriageRegistrations =
  async (): Promise<MarriageRegistrationListResponse> => {
    try {
      const response = await api.get<MarriageRegistrationListResponse>(
        "/api/marriage_registration",
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ??
          error.message ??
          "Unable to load marriage registrations.",
      );
    }
  };

export const getMarriageRegistrationById = async (
  id: string,
): Promise<MarriageRegistrationDetailResponse> => {
  try {
    const response = await api.get<MarriageRegistrationDetailResponse>(
      `/api/marriage_registration/${id}`,
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to load marriage registration.",
    );
  }
};
