import api from "../config/api";
import { BirthRegistrationData } from "@/lib/types/birth-registration";

const BirthRegistration = async (payload: BirthRegistrationData) => {
  try {
    const response = await api.post();
  } catch (error: any) {
    throw error.response?.data;
  }
};
