// utils/types.ts
export interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  salary: string;
  createdAt: string;
  recruiterId: string;
  companyId: string;
  applicationsCount?: number;
}

export interface Application {
  _id: string;
  jobId: string;
  candidateId: string;
  candidateName?: string; // optional if you're expanding user data server-side
  resumeFileName?: string;
  resumeUrl?: string;
  appliedAt: string; // ISO string
  status: "pending" | "shortlisted" | "interview" | "accepted" | "rejected";
}
