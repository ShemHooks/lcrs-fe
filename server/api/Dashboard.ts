import api from "../config/api";

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

export interface DashboardUsersStats {
  total?: number;
  active?: number;
}

export interface RecentTransaction {
  id?: number | string;
  type?: string;
  transactionType?: string;
  description?: string;
  createdAt?: string;
  created_at?: string;
  name?: string;
}

export interface DashboardData {
  birthStats: DashboardBirthStats;
  marriageStats: DashboardMarriageStats;
  deathStats: DashboardDeathStats;
  usersStats: DashboardUsersStats;
  recentTransactions: RecentTransaction[];
}

export interface DashboardResponse {
  success: boolean;
  dashboard: DashboardData;
}

export const getDashboardStats = async (): Promise<DashboardResponse> => {
  try {
    const response = await api.get<DashboardResponse>("/api/dashboard");

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to load dashboard data.",
    );
  }
};
