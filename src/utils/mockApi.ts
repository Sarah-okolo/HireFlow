
// This file is a mock API implementation to simulate backend calls
// In a real application, this would be replaced with actual API calls

import { UserRole } from "@/stores/authStore";

// Types
export interface User {
  id: string;
  username: string;
  password: string; // In real app, never store plaintext passwords
  role: UserRole;
  companyId?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  companyId: string;
  recruiterId: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
  tags: string[];
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  appliedAt: string;
}

// Helper to initialize mock data
export const initializeMockData = () => {
  // Check if mock data already exists
  if (!localStorage.getItem('mockUsers')) {
    // Initialize with empty arrays instead of dummy data
    const mockUsers: User[] = [];
    const mockJobs: Job[] = [];
    const mockApplications: Application[] = [];

    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    localStorage.setItem('mockJobs', JSON.stringify(mockJobs));
    localStorage.setItem('mockApplications', JSON.stringify(mockApplications));
  }
};
