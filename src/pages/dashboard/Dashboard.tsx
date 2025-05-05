import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { JobApplicationDialog } from "@/components/JobApplicationDialog";
import {axiosPrivate} from "@/lib/axiosPrivate";

interface Job {
  id: string;
  _id: string;
  createdAt: string;
  recruiterId: string;
  companyId: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  tags: string[];
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);

  const [recruiterStats, setRecruiterStats] = useState(null);
  const [companyStats, setCompanyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const openApplicationDialog = (job: Job) => {
    setSelectedJob(job);
    setIsApplicationDialogOpen(true);
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        if (user?.role === "candidate") {
          const { data } = await axiosPrivate.get("/jobs");
          setJobs(data.jobs || []);
        } else if (user?.role === "recruiter") {
          const { data } = await axiosPrivate.get(`/recruiters`);
          setRecruiterStats(data);
        } else if (user?.role === "company") {
          const { data } = await axiosPrivate.get("/companies");
          setCompanyStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user?.role]);

  const dashboardContent = {
    candidate: (
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
        </div>

        <div className="grid gap-4">
          {jobs.length > 0 ? (
            jobs?.map((job) => (
              <Card key={job?.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{job?.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {job?.company} • {job?.location} • {job?.type}
                      </CardDescription>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {job?.salary}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job?.tags?.map((tag, index) => (
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

    recruiter: recruiterStats && (
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <Button asChild>
            <Link to="/dashboard/jobs/create">Create Job Post</Link>
          </Button>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Active Jobs" description="Your current job postings" value={recruiterStats?.activeJobs} />
          <StatCard title="Applications" description="Total applications received" value={recruiterStats?.totalApplications} />
          <StatCard title="Shortlisted" description="Candidates shortlisted" value={recruiterStats?.shortlisted} />
        </div>

        <h2 className="text-2xl font-bold mt-4">Recent Job Posts</h2>
        <div className="grid gap-4">
          {recruiterStats?.recentJobs?.map((job) => (
            <Card key={job.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{job?.title}</CardTitle>
                    <CardDescription className="mt-1">
                      Posted {job?.postedAgo} • {job?.applicationCount} applications
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">View Applications</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">Status: <span className="text-green-600 font-medium">{job?.status}</span></span>
                    <span className="text-muted-foreground">Expires: <span className="font-medium">{job?.expiresIn}</span></span>
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

    company: companyStats && (
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Company Dashboard</h1>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Jobs" description="Job postings by your company" value={companyStats?.totalJobs} />
          <StatCard title="Recruiters" description="Active recruiters" value={companyStats?.recruiters} />
          <StatCard title="Applications" description="Total applications received" value={companyStats?.totalApplications} />
          <StatCard title="Hired" description="Candidates hired" value={companyStats?.hired} />
        </div>

        <div className="grid gap-6 grid-cols-1">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Recent Job Posts</CardTitle>
              <CardDescription>Latest job posts across your company</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {companyStats?.recentJobs?.map((job) => (
                  <li key={job.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{job?.title}</p>
                      <p className="text-sm text-muted-foreground">Posted by {job?.recruiter} • {job?.postedAgo}</p>
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center text-muted-foreground py-12">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {user?.role && dashboardContent[user?.role]}
    </DashboardLayout>
  );
}

function StatCard({ title, description, value }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}