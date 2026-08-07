import api from "../config/api";
import { BirthRegistrationData } from "@/lib/types/birth-registration";

export interface BirthRegistrationResponse {
  success: boolean;
  message: string;
  data: BirthRegistrationData & {
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const createBirthRegistration = async (
  payload: BirthRegistrationData,
): Promise<BirthRegistrationResponse> => {
  try {
    const response = await api.post<BirthRegistrationResponse>(
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
