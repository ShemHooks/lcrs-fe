import api from "../config/api";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type:
    | "transaction_created"
    | "transaction_approved"
    | "transaction_returned"
    | "review_assigned"
    | "account_update"
    | "system";
  is_read: boolean;
  related_entity_type?: string;
  related_entity_id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsResponse {
  success: boolean;
  notifications: Notification[];
  total: number;
}

export interface GetUnreadCountResponse {
  success: boolean;
  count: number;
}

/**
 * Fetch paginated notifications for the current user.
 */
export const getNotifications = async (
  page = 1,
  limit = 20,
): Promise<GetNotificationsResponse> => {
  try {
    const response = await api.get<GetNotificationsResponse>(
      `/api/notifications?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to load notifications.",
    );
  }
};

/**
 * Fetch the unread notification count.
 */
export const getUnreadCount = async (): Promise<GetUnreadCountResponse> => {
  try {
    const response = await api.get<GetUnreadCountResponse>(
      "/api/notifications/unread-count",
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to load unread count.",
    );
  }
};

/**
 * Mark a single notification as read.
 */
export const markNotificationAsRead = async (
  notificationId: string,
): Promise<void> => {
  try {
    await api.patch(`/api/notifications/${notificationId}/read`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to mark notification as read.",
    );
  }
};

/**
 * Mark all notifications as read.
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await api.patch("/api/notifications/read-all");
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to mark all notifications as read.",
    );
  }
};

/**
 * Delete a single notification.
 */
export const deleteNotification = async (
  notificationId: string,
): Promise<void> => {
  try {
    await api.delete(`/api/notifications/${notificationId}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to delete notification.",
    );
  }
};

/**
 * Create an SSE connection for real-time notifications.
 * Returns the EventSource and a cleanup function.
 */
export const createNotificationStream = (
  onNotification: (notification: Notification) => void,
  onError?: (error: Event) => void,
): (() => void) => {
  const token = sessionStorage.getItem("token");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // SSE doesn't support custom headers natively, so we pass the token as a query param
  // The backend middleware will need to accept it (or we use a workaround)
  const url = `${baseUrl}/api/notifications/stream?token=${token}`;

  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "connected") return; // Skip connection confirmation
      onNotification(data as Notification);
    } catch {
      // Ignore malformed events
    }
  };

  eventSource.onerror = (error) => {
    if (onError) onError(error);
  };

  // Cleanup function
  return () => {
    eventSource.close();
  };
};
