import api from "../config/api";

interface login_payload {
  email: string;
  password: string;
}

export const LoginApi = async (payload: login_payload) => {
  try {
    const response = await api.post("/api/auth/login", payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data;
  }
};
