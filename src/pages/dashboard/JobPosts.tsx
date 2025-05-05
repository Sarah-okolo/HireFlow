import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { JobApplicationsList } from "@/components/JobApplicationsList";
import { getMyJobPosts } from "@/services/jobsService"; // <-- axios-based function
import { Job } from "@/utils/types";

export default function JobPosts() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplications, setShowApplications] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const allJobs = await getMyJobPosts();
        const recruiterJobs = allJobs.filter(job => job.recruiterId === user?.id);
        setJobs(recruiterJobs);
      } catch (error) {
        console.error("Error loading jobs", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) loadJobs();
  }, [user?.id]);

  const openApplicationsList = (job: Job) => {
    setSelectedJob(job);
    setShowApplications(true);
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Job Posts</h1>
          <Button asChild>
            <a href="/dashboard/jobs/create">Create Job Post</a>
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading jobs...</p>
        ) : jobs.length === 0 ? (
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
            {jobs.map((job) => (
              <Card key={job._id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{job.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Posted on {new Date(job.createdAt).toLocaleDateString()} • {job.applicationsCount || 0} applications
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
            ))}
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