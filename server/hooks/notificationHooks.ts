import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback, useRef } from "react";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  createNotificationStream,
  type Notification,
} from "@/server/api/NotificationApi";

/**
 * Hook to fetch paginated notifications.
 */
export const useNotifications = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: () => getNotifications(page, limit),
  });
};

/**
 * Hook to fetch the unread notification count.
 */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    refetchInterval: 30000, // Fallback polling every 30s
  });
};

/**
 * Hook to mark a single notification as read.
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

/**
 * Hook to mark all notifications as read.
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

/**
 * Hook to delete a notification.
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

/**
 * Hook that establishes an SSE connection for real-time notifications.
 * Automatically updates the React Query cache when new notifications arrive.
 */
export const useNotificationStream = () => {
  const queryClient = useQueryClient();
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleNotification = useCallback(
    (notification: Notification) => {
      // Update the notifications list cache
      queryClient.setQueryData(
        ["notifications", 1, 20],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            notifications: [notification, ...oldData.notifications],
            total: (oldData.total || 0) + 1,
          };
        },
      );

      // Update the unread count cache
      queryClient.setQueryData(
        ["notifications", "unread-count"],
        (oldData: any) => {
          if (!oldData) return { success: true, count: 1 };
          return { ...oldData, count: (oldData.count || 0) + 1 };
        },
      );
    },
    [queryClient],
  );

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    cleanupRef.current = createNotificationStream(handleNotification);

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [handleNotification]);
};
