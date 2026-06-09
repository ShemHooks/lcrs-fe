import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUser, createUser } from "../api/UserManagement";

export const useUsers = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ["users", page, limit, search],
    queryFn: () => getAllUser(page, limit, search),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};
