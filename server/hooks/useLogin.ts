import { useMutation } from "@tanstack/react-query";
import { LoginApi } from "@/server/api/AuthApi";

export const useLogin = () => {
  return useMutation({
    mutationFn: LoginApi,
  });
};
