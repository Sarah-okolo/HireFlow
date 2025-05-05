
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosPrivate } from '@/lib/axiosPrivate';

// Define query keys
export const recruiterKeys = {
  all: ['recruiters'] as const,
  lists: () => [...recruiterKeys.all, 'list'] as const,
  byCompany: (companyId: string) => [...recruiterKeys.lists(), { companyId }] as const,
};

// Fetch recruiters by company
export const useRecruiters = (companyId: string) => {
  return useQuery({
    queryKey: recruiterKeys.byCompany(companyId),
    queryFn: async () => {
      const response = await axiosPrivate.get(`/companies/${companyId}/recruiters`);
      return response.data;
    },
    enabled: !!companyId,
  });
};

// Remove recruiter from company
export const useRemoveRecruiter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ companyId, recruiterId }: { companyId: string; recruiterId: string }) => {
      const response = await axiosPrivate.delete(`/companies/${companyId}/recruiters/${recruiterId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: recruiterKeys.byCompany(variables.companyId) });
    },
  });
};
