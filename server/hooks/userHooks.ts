import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUser,
  createUser,
  deactivateUser,
  activateUser,
  deleteUser,
} from "../api/UserManagement";

export const useUsers = (
  page: number,
  limit: number,
  search: string,
  isActive: boolean,
) => {
  return useQuery({
    queryKey: ["users", page, limit, search, isActive],
    queryFn: () => getAllUser(page, limit, search, isActive),
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

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};
