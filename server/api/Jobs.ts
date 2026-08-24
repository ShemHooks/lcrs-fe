import api from "../config/api";

export interface ReviewerJobItem {
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
    if (filters?.type && filters.type !== "All") params.type = filters.type;
    if (filters?.status && filters.status !== "All") params.status = filters.status;

    const response = await api.get<JobsResponse>("/api/jobs", { params });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        "Unable to load review jobs."
    );
  }
};
