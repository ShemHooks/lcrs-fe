import api from "../config/api";

/**
 * Types matching Backend /api/analytics responses
 * (see Backend/docs/ANALYTICS_API.md).
 */

export interface AdminAnalyticsData {
  year: number;
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  registrations: {
    births: number;
    marriages: number;
    deaths: number;
    total: number;
  };
  transactions: {
    total: number;
    byStatus: Record<string, number>;
  };
  processingVolume: {
    months: string[];
    transactions: number[];
    births: number[];
    marriages: number[];
    deaths: number[];
  };
}

export interface ClerkAnalyticsData {
  year: number;
  submitted: number;
  byStatus: Record<string, number>;
  pending: number;
  returned: number;
  approved: number;
  completed: number;
  byPurpose: {
    Birth: number;
    Marriage: number;
    Death: number;
  };
}

export interface ReviewerAnalyticsData {
  year: number;
  reviewed: number;
  pendingReview: number;
  approved: number;
  returned: number;
  approvalRate: number | null;
  returnRate: number | null;
  averageReviewMinutes: number | null;
}

export interface SharedAnalyticsData {
  year: number;
  births: {
    total: number;
    byGender: { Male: number; Female: number; Unknown: number };
  };
  marriages: {
    total: number;
    byAgeRange: { label: string; count: number }[];
  };
  deaths: {
    total: number;
    byAgeRange: { label: string; count: number }[];
  };
}

interface AnalyticsResponse<T> {
  success: boolean;
  data: T;
}

const buildYearQuery = (year?: number) => (year ? `?year=${year}` : "");

const getAnalytics = async <T>(path: string): Promise<T> => {
  try {
    const response = await api.get<AnalyticsResponse<T>>(path);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to load analytics data.",
    );
  }
};

export const getAdminAnalytics = (year?: number) =>
  getAnalytics<AdminAnalyticsData>(`/api/analytics/admin${buildYearQuery(year)}`);

export const getClerkAnalytics = (year?: number) =>
  getAnalytics<ClerkAnalyticsData>(`/api/analytics/clerk${buildYearQuery(year)}`);

export const getReviewerAnalytics = (year?: number) =>
  getAnalytics<ReviewerAnalyticsData>(
    `/api/analytics/reviewer${buildYearQuery(year)}`,
  );

export const getSharedAnalytics = (year?: number) =>
  getAnalytics<SharedAnalyticsData>(`/api/analytics/shared${buildYearQuery(year)}`);
