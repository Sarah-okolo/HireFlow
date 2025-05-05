// src/api/mutations/useRegisterMutation.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios"; // <- regular axios instance

type RegisterPayload = {
  username: string;
  password: string;
  role: "candidate" | "recruiter" | "company";
  companyId?: string;
  companyName?: string;
};

type RegisterResponse = {
  token: string;
  user: {
    _id: string;
    username: string;
    role: string;
    companyId?: string;
  };
};

export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: async (payload) => {
      const response = await axios.post("https://hireflow-server-production.up.railway.app/signup", payload);
      return response.data;
    },
  });
};
