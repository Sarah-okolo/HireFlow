// hooks/useLoginMutation.ts
import { useMutation } from '@tanstack/react-query';
import { axiosPrivate } from '@/lib/axiosPrivate';
import Cookies from 'js-cookie';

type LoginCredentials = {
  username: string;
  password: string;
};

type UserRole = 'candidate' | 'recruiter' | 'company';

type LoginResponse = {
  token: string;
  user: {
    _id: string;
    username: string;
    role: UserRole;
    companyId?: string;
  };
};

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      const res = await axiosPrivate.post('/api/auth/login', credentials);
      return res.data;
    },
  });
