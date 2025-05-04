
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
  resumeFileName: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  appliedAt: string;
}

// Helper to initialize mock data
export const initializeMockData = () => {
  // Check if mock data already exists
  if (!localStorage.getItem('mockUsers')) {
    // Initialize with empty arrays
    const mockUsers: User[] = [];
    const mockJobs: Job[] = [];
    const mockApplications: Application[] = [];

    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    localStorage.setItem('mockJobs', JSON.stringify(mockJobs));
    localStorage.setItem('mockApplications', JSON.stringify(mockApplications));
  }
};

// Helper function to generate a unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Applications API
export const submitApplication = (jobId: string, candidateId: string, resumeFileName: string): Application => {
  const applications = JSON.parse(localStorage.getItem('mockApplications') || '[]');
  
  // Check if application already exists
  const existingApp = applications.find(
    (app: Application) => app.jobId === jobId && app.candidateId === candidateId
  );

  if (existingApp) {
    throw new Error('You have already applied for this job');
  }

  const newApplication: Application = {
    id: generateId(),
    jobId,
    candidateId,
    resumeFileName,
    status: 'pending',
    appliedAt: new Date().toISOString(),
  };

  applications.push(newApplication);
  localStorage.setItem('mockApplications', JSON.stringify(applications));
  
  return newApplication;
};

export const getApplicationsByJobId = (jobId: string): Application[] => {
  const applications = JSON.parse(localStorage.getItem('mockApplications') || '[]');
  return applications.filter((app: Application) => app.jobId === jobId);
};

export const getApplicationsByCandidate = (candidateId: string): Application[] => {
  const applications = JSON.parse(localStorage.getItem('mockApplications') || '[]');
  return applications.filter((app: Application) => app.candidateId === candidateId);
};

export const getJobById = (jobId: string): Job | undefined => {
  const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
  return jobs.find((job: Job) => job.id === jobId);
};

export const getAllJobs = (): Job[] => {
  return JSON.parse(localStorage.getItem('mockJobs') || '[]');
};

