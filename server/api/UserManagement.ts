import api from "../config/api";

interface createUserTypes {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  role: string;
}

interface UpdateUserPayload {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
}

export const getAllUser = async (
  page: number,
  limit: number,
  search: string,
  isActive: boolean,
  role: string,
) => {
  try {
    const response = await api.get("/api/users", {
      params: {
        page,
        limit,
        search,
        isActive,
        role,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const createUser = async (payload: createUserTypes) => {
  try {
    const response = await api.post("/api/users/create", payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deactivateUser = async (id: string) => {
  try {
    const response = await api.put(`/api/users/${id}/deactivate`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const activateUser = async (id: string) => {
  try {
    const response = await api.put(`/api/users/${id}/activate`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`/api/users/${id}`);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getUserByID = async (id: string) => {
  try {
    const response = await api.get(`/api/users/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateUserData = async (data: UpdateUserPayload) => {
  try {
    const { id, ...payload } = data;

    const response = await api.put(`/api/users/${id}`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
