import api from "../config/api";

export const getUserPersonalData = async () => {
  try {
    const response = await api.get("/api/auth/me");
    return response.data;
  } catch (error: any) {
    throw error.data;
  }
};
