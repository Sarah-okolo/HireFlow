
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";
import { Application, Job, getApplicationsByCandidate, getJobById } from "@/utils/mockApi";
import { format } from "date-fns";

interface ApplicationWithJob extends Application {
  job?: Job;
}

export default function Applications() {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch candidate's applications
      const userApplications = getApplicationsByCandidate(user.id);
      
      // Get job details for each application
      const applicationsWithJobs = userApplications.map(application => {
        const job = getJobById(application.jobId);
        return {
          ...application,
          job
        };
      });
      
      setApplications(applicationsWithJobs);
      setLoading(false);
    }
  }, [user]);

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'shortlisted': return 'bg-blue-500 hover:bg-blue-600';
      case 'accepted': return 'bg-green-500 hover:bg-green-600';
      case 'rejected': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        </div>
        
        {loading ? (
          <div className="text-center py-8">Loading your applications...</div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">You haven't applied to any jobs yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{application.job?.title || "Unknown Job"}</CardTitle>
                      <CardDescription className="mt-1">
                        {application.job?.company || "Unknown Company"} • {application.job?.location || "Unknown Location"}
                      </CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm text-white ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Resume: </span>
                        <span className="font-medium">{application.resumeFileName}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Applied on: </span>
                        <span className="font-medium">{format(new Date(application.appliedAt), 'PPP')}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
