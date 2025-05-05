import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Application } from "@/utils/types";
import { updateApplicationStatus } from "@/services/applicationService";
import { getApplicationsByJobId } from "@/services/applicationService"; 
import { Job } from "@/utils/types";

interface JobApplicationsListProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobApplicationsList({ job, open, onOpenChange }: JobApplicationsListProps) {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (open && job) {
      // Fetch applications for the job
      getApplicationsByJobId(job._id).then((jobApplications) => {
        setApplications(jobApplications);
      }).catch((error) => {
        console.error("Error fetching job applications:", error);
      });
    }
  }, [open, job]);

  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case "shortlisted":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Shortlisted</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Accepted</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Handle status update
  const handleStatusUpdate = async (applicationId: string, action: "shortlist" | "reject" | "approve") => {
    try {
      await updateApplicationStatus(applicationId, action);
      // Map action to the corresponding Application status
      const statusMap: Record<typeof action, Application["status"]> = {
        shortlist: "shortlisted",
        reject: "rejected",
        approve: "accepted",
      };
      // Update the local applications list to reflect the change (optimistic UI)
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === applicationId
            ? { ...application, status: statusMap[action] }
            : application
        )
      );
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Applications for {job.title}</DialogTitle>
          <DialogDescription>
            Review all applications for this job posting.
          </DialogDescription>
        </DialogHeader>

        {applications.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No applications received yet.</p>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application._id}>
                    <TableCell className="font-medium">{application.candidateId}</TableCell>
                    <TableCell>{application.resumeFileName}</TableCell>
                    <TableCell>{format(new Date(application.appliedAt), "PPP")}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(application._id, "shortlist")}
                        disabled={application.status === "shortlisted"}
                      >
                        Shortlist
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleStatusUpdate(application._id, "reject")}
                        disabled={application.status === "rejected"}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-500"
                        onClick={() => handleStatusUpdate(application._id, "approve")}
                        disabled={application.status === "accepted"}
                      >
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
