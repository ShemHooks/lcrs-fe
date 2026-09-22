import api from "../config/api";

// ============================================================
// SHARED TYPES
// ============================================================

export interface DashboardBirthStats {
  total: number;
  male?: number;
  female?: number;
}

export interface DashboardMarriageStats {
  total: number;
}

export interface DashboardDeathStats {
  total: number;
  male?: number;
  female?: number;
}

// ============================================================
// CLERK DASHBOARD
// ============================================================

export interface RecentTransaction {
  id: string;
  transaction_purpose: "Birth" | "Marriage" | "Death";

  status: string;

  certificate_id: string;

  createdAt: string;
  updatedAt?: string;
}

export interface ClerkDashboardData {
  birthStats: DashboardBirthStats;

  marriageStats: DashboardMarriageStats;

  deathStats: DashboardDeathStats;

  todayRegistrations: number;

  pendingTransactions: number;

  returnedTransactions: number;

  recentTransactions: RecentTransaction[];
}

export interface ClerkDashboardResponse {
  success: boolean;
  dashboard: ClerkDashboardData;
}

export const getDashboardStats = async (): Promise<ClerkDashboardResponse> => {
  try {
    const response = await api.get<ClerkDashboardResponse>(
      "/api/dashboard/clerk",
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to load clerk dashboard data.",
    );
  }
};

// ============================================================
// REVIEWER DASHBOARD
// ============================================================

export interface ReviewerQueueStats {
  birth: number;
  marriage: number;
  death: number;
  resubmitted?: number;
}

export interface ReviewerJob {
  id: string;

  transaction_purpose: "Birth" | "Marriage" | "Death";

  certificate_id: string;

  status: "Pending" | "Returned" | "Approved";

  createdAt: string;

  clerk?: {
    id: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
  };

  registrantName?: string;
}

export interface ReviewerActivity {
  id: string;

  transaction_purpose: "Birth" | "Marriage" | "Death";

  certificate_id: string;

  status: "Approved" | "Returned";

  reviewedAt?: string;

  reviewComment?: string;
}

export interface ReviewerDashboardData {
  pendingReview: number;

  reviewedToday: number;

  returnedToday: number;

  approvedThisWeek: number;

  queue: ReviewerQueueStats;

  pendingJobs: ReviewerJob[];

  recentActivity: ReviewerActivity[];
}

export interface ReviewerDashboardResponse {
  success: boolean;
  dashboard: ReviewerDashboardData;
}

export const getReviewerDashboardStats =
  async (): Promise<ReviewerDashboardResponse> => {
    try {
      const response = await api.get<ReviewerDashboardResponse>(
        "/api/dashboard/reviewer",
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ??
          error.message ??
          "Unable to load reviewer dashboard data.",
      );
    }
  };

// ============================================================
// ADMIN / REGISTRAR DASHBOARD
// ============================================================

export interface AdminDashboardData {
  birthStats: DashboardBirthStats;

  marriageStats: DashboardMarriageStats;

  deathStats: DashboardDeathStats;

  activeUsers: number;

  pendingRegistration: number;
}

export interface AdminDashboardResponse {
  success: boolean;

  dashboard: AdminDashboardData;
}

export const getAdminDashboardStats =
  async (): Promise<AdminDashboardResponse> => {
    try {
      const response = await api.get<AdminDashboardResponse>(
        "/api/dashboard/admin",
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ??
          error.message ??
          "Unable to load admin dashboard data.",
      );
    }
  };
