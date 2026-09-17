import api from "../config/api";

// ============================================================
// REVIEWER JOBS
// ============================================================

export interface ReviewerJobItem {
  certificateId: string;
  id: string;
  type: "Birth" | "Marriage" | "Death";
  subjectName: string;
  registryNumber: string;
  childName: string;
  submittedBy: string;
  submittedAt: string;
  status: "Pending" | "Returned" | "Approved";
  reviewComment?: string | null;
}

export interface JobsResponse {
  success: boolean;
  count: {
    pending: number;
    returned: number;
    approve: number;
    overall: number;
  };
  data: ReviewerJobItem[];
}

export interface JobsFilters {
  type?: string;
  status?: string;
}

export const getJobs = async (filters?: JobsFilters): Promise<JobsResponse> => {
  try {
    const params: Record<string, string> = {};

    if (filters?.type && filters.type !== "All") {
      params.type = filters.type;
    }

    if (filters?.status && filters.status !== "All") {
      params.status = filters.status;
    }

    const response = await api.get<JobsResponse>("/api/jobs", { params });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to load review jobs.",
    );
  }
};

// ============================================================
// RETURN JOB
// ============================================================

export interface ReturnJobResponse {
  success: boolean;
  message: string;

  data: {
    id: string;
    certificate_id: string;
    status: string;
    reviewer_id: string;
    review_comment: string;
    reviewed_at: string;
  };
}

export const returnJob = async (
  certificateId: string,
  reason: string,
): Promise<ReturnJobResponse> => {
  try {
    const response = await api.put<ReturnJobResponse>(
      `/api/transactions/certificate/${certificateId}/return`,
      {
        reason,
      },
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ?? error.message ?? "Unable to return job.",
    );
  }
};

// ============================================================
// CLERK JOBS
// ============================================================

export type ClerkJobStatus = "Pending" | "Returned" | "Approved";

export type ClerkJobType = "Birth" | "Marriage" | "Death";

export interface ClerkJobReviewer {
  last_name: any;
  first_name: any;
  id: string;
  name: string;
  position: string | null;
}

export interface ClerkJobItem {
  // Transaction ID
  id: string;

  // Birth / Marriage / Death registration ID
  certificateId: string;

  type: ClerkJobType;

  subjectName: string;
  registryNumber: string | null;

  status: ClerkJobStatus;

  reviewComment: string | null;
  reviewedAt: string | null;

  reviewer: ClerkJobReviewer | null;

  submittedAt: string;
  updatedAt: string;
}

export interface ClerkJobsResponse {
  success: boolean;
  count: number;
  data: ClerkJobItem[];
}

export interface ClerkJobsFilters {
  type?: ClerkJobType | "All";
  status?: ClerkJobStatus | "All";
}

export const getClerkJobs = async (
  filters?: ClerkJobsFilters,
): Promise<ClerkJobsResponse> => {
  try {
    const params: Record<string, string> = {};

    if (filters?.type && filters.type !== "All") {
      params.type = filters.type;
    }

    if (filters?.status && filters.status !== "All") {
      params.status = filters.status;
    }

    const response = await api.get<ClerkJobsResponse>(
      "/api/transactions/clerk/jobs",
      {
        params,
      },
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to load clerk jobs.",
    );
  }
};
