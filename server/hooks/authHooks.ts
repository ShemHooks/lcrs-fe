import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { LoginApi, ChangePasswordApi } from "@/server/api/AuthApi";
import { getUserPersonalData } from "../api/AppData";

export const useLogin = () => {
  return useMutation({
    mutationFn: LoginApi,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ChangePasswordApi,
  });
};

export const getProfile = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUserPersonalData,
  });
};
