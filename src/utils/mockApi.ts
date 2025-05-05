
// This file is a mock API implementation to simulate backend calls
// In a real application, this would be replaced with actual API calls

import { UserRole } from "@/types/user";
import { Job } from "@/types/job";
import { Application } from "@/types/application";

export type { UserRole, Job, Application };

// Helper to initialize mock data
export const initializeMockData = () => {
  // Check if mock data already exists
  if (!localStorage.getItem('mockUsers')) {
    // Initialize with empty arrays
    const mockUsers: any[] = [];
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

// User API
export const getUserById = (userId: string) => {
  const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
  return users.find((user: any) => user.id === userId);
};

export const getUsersByCompany = (companyId: string) => {
  const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
  return users.filter((user: any) => user.companyId === companyId && user.role === 'recruiter');
};

export const removeRecruiterFromCompany = (recruiterId: string): boolean => {
  const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
  const index = users.findIndex((user: any) => user.id === recruiterId);
  
  if (index !== -1) {
    users.splice(index, 1);
    localStorage.setItem('mockUsers', JSON.stringify(users));
    return true;
  }
  return false;
};

// Jobs API
export const createJob = (job: Omit<Job, "id" | "postedAt">) => {
  const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
  
  const newJob: Job = {
    ...job,
    id: generateId(),
    postedAt: new Date().toISOString(),
  };

  jobs.push(newJob);
  localStorage.setItem('mockJobs', JSON.stringify(jobs));
  
  return newJob;
};

export const getJobById = (jobId: string) => {
  const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
  return jobs.find((job: Job) => job.id === jobId);
};

export const getAllJobs = () => {
  return JSON.parse(localStorage.getItem('mockJobs') || '[]');
};

export const getJobsByCompany = (companyId: string) => {
  const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
  return jobs.filter((job: Job) => job.companyId === companyId);
};

export const getJobsByRecruiter = (recruiterId: string) => {
  const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
  return jobs.filter((job: Job) => job.recruiterId === recruiterId);
};

// Applications API
export const submitApplication = (jobId: string, candidateId: string, candidateName: string, resumeFileName: string) => {
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
    candidateName,
    resumeFileName,
    status: 'pending',
    appliedAt: new Date().toISOString(),
  };

  applications.push(newApplication);
  localStorage.setItem('mockApplications', JSON.stringify(applications));
  
  return newApplication;
};

export const updateApplicationStatus = (applicationId: string, status: Application['status']) => {
  const applications = JSON.parse(localStorage.getItem('mockApplications') || '[]');
  const index = applications.findIndex((app: Application) => app.id === applicationId);
  
  if (index !== -1) {
    applications[index].status = status;
    localStorage.setItem('mockApplications', JSON.stringify(applications));
    return applications[index];
  }
  
  return null;
};

export const getApplicationById = (applicationId: string) => {
  const applications = JSON.parse(localStorage.getItem('mockApplications') || '[]');
  return applications.find((app: Application) => app.id === applicationId);
};

export const getApplicationsByJobId = (jobId: string) => {
  const applications = JSON.parse(localStorage.getItem('mockApplications') || '[]');
  return applications.filter((app: Application) => app.jobId === jobId);
};

export const getApplicationsByCandidate = (candidateId: string) => {
  const applications = JSON.parse(localStorage.getItem('mockApplications') || '[]');
  return applications.filter((app: Application) => app.candidateId === candidateId);
};

export const getShortlistedApplicationsByCompany = (companyId: string) => {
  const applications = JSON.parse(localStorage.getItem('mockApplications') || '[]');
  const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
  
  // Get all jobs for this company
  const companyJobs = jobs.filter((job: Job) => job.companyId === companyId);
  const companyJobIds = companyJobs.map((job: Job) => job.id);
  
  // Get all shortlisted applications for these jobs
  return applications.filter((app: Application) => 
    companyJobIds.includes(app.jobId) && app.status === 'shortlisted'
  );
};

// Clear all mock data
export const clearAllMockData = () => {
  localStorage.setItem('mockUsers', JSON.stringify([]));
  localStorage.setItem('mockJobs', JSON.stringify([]));
  localStorage.setItem('mockApplications', JSON.stringify([]));
};
