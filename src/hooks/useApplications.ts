
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Application } from '@/types/application';

// Define query keys
export const applicationKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...applicationKeys.lists(), filters] as const,
  details: () => [...applicationKeys.all, 'detail'] as const,
  detail: (id: string) => [...applicationKeys.details(), id] as const,
  byJob: (jobId: string) => [...applicationKeys.lists(), { jobId }] as const,
  byCandidate: (candidateId: string) => [...applicationKeys.lists(), { candidateId }] as const,
  shortlisted: (companyId: string) => [...applicationKeys.lists(), { companyId, status: 'shortlisted' }] as const,
};

// Fetch applications by job ID
export const useApplicationsByJob = (jobId: string) => {
  return useQuery({
    queryKey: applicationKeys.byJob(jobId),
    queryFn: async () => {
      const response = await apiClient.get(`/jobs/${jobId}/applications`);
      return response.data;
    },
    enabled: !!jobId,
  });
};

// Fetch applications by candidate ID
export const useApplicationsByCandidate = (candidateId: string) => {
  return useQuery({
    queryKey: applicationKeys.byCandidate(candidateId),
    queryFn: async () => {
      const response = await apiClient.get(`/candidates/${candidateId}/applications`);
      return response.data;
    },
    enabled: !!candidateId,
  });
};

// Fetch shortlisted applications by company
export const useShortlistedApplications = (companyId: string) => {
  return useQuery({
    queryKey: applicationKeys.shortlisted(companyId),
    queryFn: async () => {
      const response = await apiClient.get(`/companies/${companyId}/applications/shortlisted`);
      return response.data;
    },
    enabled: !!companyId,
  });
};

// Submit application
export const useSubmitApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (application: {
      jobId: string;
      candidateId: string;
      resumeFileName: string;
    }) => {
      const response = await apiClient.post('/applications', application);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.byJob(variables.jobId) });
      queryClient.invalidateQueries({ queryKey: applicationKeys.byCandidate(variables.candidateId) });
    },
  });
};

// Update application status
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: Application['status'] }) => {
      const response = await apiClient.patch(`/applications/${applicationId}/status`, { status });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: applicationKeys.byJob(data.jobId) });
      queryClient.invalidateQueries({ queryKey: applicationKeys.byCandidate(data.candidateId) });
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
    },
  });
};
