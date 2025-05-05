// services/jobsService.ts
import { axiosPrivate } from "@/lib/axiosPrivate";
import { Job } from "@/utils/types";

export const getMyJobPosts = async (): Promise<Job[]> => {
  const response = await axiosPrivate.get("/jobs");
  return response.data;
};
