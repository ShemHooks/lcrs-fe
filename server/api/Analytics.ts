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

export interface DashboardAnalyticsData {
  year: number;
  recordCounts: {
    births: number;
    marriages: number;
    deaths: number;
  };
  monthlyTrends: {
    months: string[];
    births: number[];
    marriages: number[];
    deaths: number[];
  };
  weeklyTrends: {
    weeks: string[];
    births: { week: string; count: number }[];
    marriages: { week: string; count: number }[];
    deaths: { week: string; count: number }[];
  };
  births: {
    monthlyByGender: { Male: number[]; Female: number[] };
    byBarangay: { label: string; count: number }[];
  };
  deaths: {
    byGender: { Male: number; Female: number; Unknown: number };
    monthlyByGender: { Male: number[]; Female: number[] };
    byAgeBracket: { label: string; count: number }[];
  };
  marriages: {
    byAgeBracket: {
      groom: { label: string; count: number }[];
      bride: { label: string; count: number }[];
    };
  };
}

export interface ResidencyReportData {
  year: number;
  birth: {
    total: number;
    resident: number;
    nonResident: number;
    rows: {
      id: string;
      createdAt: string;
      name: string;
      motherName: string;
      city: string;
      isResident: boolean;
    }[];
  };
  marriage: {
    total: number;
    resident: number;
    nonResident: number;
    unknown: number;
    rows: {
      id: string;
      createdAt: string;
      groom: string;
      bride: string;
      isResident: boolean | null;
    }[];
  };
  death: {
    total: number;
    resident: number;
    nonResident: number;
    unknown: number;
    rows: {
      id: string;
      createdAt: string;
      name: string;
      isResident: boolean | null;
    }[];
  };
}

export interface NationalitySearchData {
  year: number;
  query: string;
  results: {
    birth: NationalitySearchRow[];
    marriage: NationalitySearchRow[];
    death: NationalitySearchRow[];
  };
}

export interface NationalitySearchRow {
  id: string;
  createdAt: string;
  name: string;
  detail: string;
  nationality: string;
}

export interface DualEventReportData {
  year: number;
  count: number;
  results: {
    birthRecordId: string;
    deathRecordId: string;
    name: string;
    dateOfBirth: string | null;
    dateOfDeath: string | null;
    sameDay: boolean;
  }[];
}

export interface MultipleMarriageReportData {
  year: number;
  count: number;
  results: {
    id: string;
    createdAt: string;
    groom: string;
    bride: string;
    dateOfMarriage: string | null;
    groomMarriageCount: number;
    brideMarriageCount: number;
  }[];
}

export interface ReportsBundleData {
  residency: ResidencyReportData;
  dualEvents: DualEventReportData | null;
  multipleMarriages: MultipleMarriageReportData | null;
}

interface AnalyticsResponse<T> {
  success: boolean;
  data: T;
}

interface ApiErrorShape {
  message?: string;
}

const buildYearQuery = (year?: number) => (year ? `?year=${year}` : "");

const getAnalytics = async <T>(path: string): Promise<T> => {
  try {
    const response = await api.get<AnalyticsResponse<T>>(path);
    return response.data.data;
  } catch (error) {
    const apiError = error as {
      response?: { data?: ApiErrorShape };
      message?: string;
    };

    throw new Error(
      apiError.response?.data?.message ??
        apiError.message ??
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

export const getDashboardAnalytics = (year?: number) =>
  getAnalytics<DashboardAnalyticsData>(
    `/api/analytics/dashboard${buildYearQuery(year)}`,
  );

export const getResidencyReports = (year?: number) =>
  getAnalytics<ResidencyReportData>(
    `/api/analytics/reports/residency${buildYearQuery(year)}`,
  );

export const searchNationality = (nationality: string, year?: number) => {
  const params = new URLSearchParams();

  if (year) params.set("year", String(year));

  if (nationality.trim()) params.set("nationality", nationality.trim());

  const query = params.toString();

  return getAnalytics<NationalitySearchData>(
    `/api/analytics/reports/nationality${query ? `?${query}` : ""}`,
  );
};

export const getReportsBundle = (year?: number, includeUnlinked = true) => {
  const params = new URLSearchParams();

  if (year) params.set("year", String(year));

  if (!includeUnlinked) params.set("includeUnlinked", "false");

  const query = params.toString();

  return getAnalytics<ReportsBundleData>(
    `/api/analytics/reports/all${query ? `?${query}` : ""}`,
  );
};
