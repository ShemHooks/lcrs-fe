import api from "../config/api";

interface createUserTypes {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
}

export const getAllUser = async (
  page: number,
  limit: number,
  search: string,
) => {
  try {
    const response = await api.get("/api/users", {
      params: {
        page,
        limit,
        search,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const createUser = async (payload: createUserTypes) => {
  try {
    const response = await api.post("/api/users", payload);
    return response.data;
  } catch (error: any) {
    throw error.data;
  }
};
