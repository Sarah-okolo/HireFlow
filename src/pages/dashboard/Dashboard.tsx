
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Job, getAllJobs } from "@/utils/mockApi";
import { JobApplicationDialog } from "@/components/JobApplicationDialog";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  
  const openApplicationDialog = (job: Job) => {
    setSelectedJob(job);
    setIsApplicationDialogOpen(true);
  };
  
  // Mock jobs for display
  const mockJobs = getAllJobs();

  // Content based on user role
  const dashboardContent = {
    candidate: (
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
        </div>
        
        <div className="grid gap-4">
          {mockJobs.length > 0 ? (
            mockJobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{job.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {job.company} • {job.location} • {job.type}
                      </CardDescription>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {job.salary}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag, index) => (
                      <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button size="sm" onClick={() => openApplicationDialog(job)}>Apply Now</Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No job listings available at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {selectedJob && (
          <JobApplicationDialog 
            job={selectedJob}
            open={isApplicationDialogOpen}
            onOpenChange={setIsApplicationDialogOpen}
          />
        )}
      </div>
    ),
    
    recruiter: (
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <Button asChild>
            <Link to="/dashboard/jobs/create">Create Job Post</Link>
          </Button>
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Active Jobs</CardTitle>
              <CardDescription>Your current job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">8</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>Total applications received</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">45</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shortlisted</CardTitle>
              <CardDescription>Candidates shortlisted</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12</p>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mt-4">Recent Job Posts</h2>
        <div className="grid gap-4">
          {[1, 2, 3].map((job) => (
            <Card key={job}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Frontend Developer</CardTitle>
                    <CardDescription className="mt-1">
                      Posted 3 days ago • 15 applications
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">View Applications</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">Status: <span className="text-green-600 font-medium">Active</span></span>
                    <span className="text-muted-foreground">Expires: <span className="font-medium">30 days</span></span>
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
      </div>
    ),
    
    company: (
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Company Dashboard</h1>
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Jobs</CardTitle>
              <CardDescription>Job postings by your company</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">24</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recruiters</CardTitle>
              <CardDescription>Active recruiters</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">6</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>Total applications received</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">128</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hired</CardTitle>
              <CardDescription>Candidates hired</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 grid-cols-1">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Recent Job Posts</CardTitle>
              <CardDescription>Latest job posts across your company</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[1, 2, 3].map((job) => (
                  <li key={job} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Software Engineer</p>
                      <p className="text-sm text-muted-foreground">Posted by John Doe • 2 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </li>
                ))}
              </ul>
              <Button variant="ghost" size="sm" className="w-full mt-4">View All Jobs</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  };

  return (
    <DashboardLayout>
      {user?.role && dashboardContent[user.role]}
    </DashboardLayout>
  );
}
