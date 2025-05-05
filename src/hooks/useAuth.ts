
import { useMutation } from '@tanstack/react-query';
import { axiosPrivate } from '@/lib/axiosPrivate';
import { useAuthStore } from '@/stores/authStore';
import Cookies from 'js-cookie';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  role: 'candidate' | 'recruiter' | 'company';
  companyId?: string;
  companyName?: string;
}

export const useLogin = () => {
  const { login } = useAuthStore();
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await axiosPrivate.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Save token to cookies
      Cookies.set('token', data.token, { expires: 7 }); // Expires in 7 days
      
      // Update auth store with user data
      login({
        id: data.user.id,
        username: data.user.username,
        role: data.user.role,
        companyId: data.user.companyId
      });
    },
  });
};

export const useRegister = () => {
  const { login } = useAuthStore();
  
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await axiosPrivate.post('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Save token to cookies
      Cookies.set('token', data.token, { expires: 7 }); // Expires in 7 days
      
      // Update auth store with user data
      login({
        id: data.user.id,
        username: data.user.username,
        role: data.user.role,
        companyId: data.user.companyId
      });
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  
  return useMutation({
    mutationFn: async () => {
      return await axiosPrivate.post('/auth/logout');
    },
    onSettled: () => {
      // Always clear regardless of success/failure
      Cookies.remove('token');
      logout();
    },
  });
};
