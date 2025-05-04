
import { useAuthStore } from "@/stores/authStore";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuthStore();

  // Content based on user role
  const dashboardContent = {
    candidate: (
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
        </div>
        
        <div className="grid gap-4">
          {/* Mock job listings */}
          {[1, 2, 3, 4, 5].map((job) => (
            <Card key={job} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Senior React Developer</CardTitle>
                    <CardDescription className="mt-1">
                      TechCorp Inc. • Remote • Full-Time
                    </CardDescription>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    $120K - $150K
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  We are looking for an experienced React developer to join our team and help build our next-generation web applications. The ideal candidate will have 5+ years of experience...
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">React</span>
                  <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">TypeScript</span>
                  <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">Node.js</span>
                </div>
                <Button size="sm">Apply Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
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
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
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
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest candidate applications</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[1, 2, 3].map((app) => (
                  <li key={app} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Jane Smith</p>
                      <p className="text-sm text-muted-foreground">Applied for UX Designer • 1 day ago</p>
                    </div>
                    <Button variant="outline" size="sm">Review</Button>
                  </li>
                ))}
              </ul>
              <Button variant="ghost" size="sm" className="w-full mt-4">View All Applications</Button>
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
