import api from "../config/api";

interface login_payload {
  email: string;
  password: string;
}

interface change_password_payload {
  currentPassword: string;
  newPassword: string;
}

export const LoginApi = async (payload: login_payload) => {
  try {
    const response = await api.post("/api/auth/login", payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data;
  }
};

export const ChangePasswordApi = async (payload: change_password_payload) => {
  try {
    const response = await api.put("/api/auth/change-password", payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data;
  }
};
