import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { LoginApi } from "@/server/api/AuthApi";
import { getUserPersonalData } from "../api/AppData";

export const useLogin = () => {
  return useMutation({
    mutationFn: LoginApi,
  });
};

export const getProfile = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUserPersonalData,
  });
};
