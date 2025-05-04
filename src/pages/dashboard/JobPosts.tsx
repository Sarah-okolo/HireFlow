
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { Job, getAllJobs, getApplicationsByJobId } from "@/utils/mockApi";
import { JobApplicationsList } from "@/components/JobApplicationsList";

export default function JobPosts() {
  const { user } = useAuthStore();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplications, setShowApplications] = useState(false);
  
  const openApplicationsList = (job: Job) => {
    setSelectedJob(job);
    setShowApplications(true);
  };
  
  // Filter jobs by recruiter ID
  const recruiterJobs = getAllJobs().filter(job => job.recruiterId === user?.id);

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Job Posts</h1>
          <Button asChild>
            <a href="/dashboard/jobs/create">Create Job Post</a>
          </Button>
        </div>
        
        {recruiterJobs.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">You don't have any job posts yet.</p>
              <Button className="mt-4" asChild>
                <a href="/dashboard/jobs/create">Create Your First Job Post</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {recruiterJobs.map((job) => {
              const applicationsCount = getApplicationsByJobId(job.id).length;
              
              return (
                <Card key={job.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Posted on {new Date(job.postedAt).toLocaleDateString()} • {applicationsCount} applications
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => openApplicationsList(job)}>
                        View Applications
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">Location: <span className="font-medium">{job.location}</span></span>
                        <span className="text-muted-foreground">Type: <span className="font-medium">{job.type}</span></span>
                        <span className="text-muted-foreground">Salary: <span className="font-medium">{job.salary}</span></span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">Edit</Button>
                        <Button size="sm" variant="ghost" className="text-red-500">Delete</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      {selectedJob && (
        <JobApplicationsList 
          job={selectedJob}
          open={showApplications}
          onOpenChange={setShowApplications}
        />
      )}
    </DashboardLayout>
  );
}
