import { axiosPrivate } from "@/lib/axiosPrivate";
import { Application } from "@/utils/types"; 

export const getApplicationsForJob = async (jobId: string): Promise<Application[]> => {
  const response = await axiosPrivate.get(`/applications/job/${jobId}`);
  return response.data;
};

// Update application status (shortlist, reject, approve)
export const updateApplicationStatus = async (
  id: string,
  action: "shortlist" | "reject" | "approve"
) => {
  const response = await axiosPrivate.post(`/applications/${id}/${action}`);
  return response.data;
};

// Fetch applications for a specific job by ID
export const getApplicationsByJobId = async (jobId: string) => {
  try {
    const response = await axiosPrivate.get(`/applications?jobId=${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw new Error("Failed to fetch applications");
  }
};