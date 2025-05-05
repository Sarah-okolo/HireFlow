import { useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Application } from "@/utils/types";
import { Job } from "@/utils/types";


interface ShortlistedApplicationsListProps {
  applications: Application[];
  jobs: Job[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplicationUpdated?: () => void;
}

export function ShortlistedApplicationsList({
  applications,
  jobs,
  open,
  onOpenChange,
  onApplicationUpdated
}: ShortlistedApplicationsListProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleStatusChange = async (
    applicationId: string,
    newStatus: Application["status"]
  ) => {
    setProcessingId(applicationId);
    try {
      await axios.put(`/api/applications/${applicationId}/status`, {
        status: newStatus
      });

      toast({
        title: "Status updated",
        description: `Application status changed to ${newStatus}`
      });

      if (onApplicationUpdated) {
        onApplicationUpdated();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: Application["status"]) => {
    const variants: Record<string, string> = {
      shortlisted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      interview: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      accepted: "bg-green-500/10 text-green-500 border-green-500/20",
      rejected: "bg-red-500/10 text-red-500 border-red-500/20"
    };

    return (
      <Badge variant="outline" className={variants[status] || ""}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getJobTitle = (jobId: string) => {
    const job = jobs.find((j) => j._id === jobId);
    return job ? job.title : "Unknown Job";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Shortlisted Applications</DialogTitle>
          <DialogDescription>
            Review shortlisted candidates and decide whether to grant interviews
            or reject.
          </DialogDescription>
        </DialogHeader>

        {applications.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              No shortlisted applications available.
            </p>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job Position</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell className="font-medium">
                      {app.candidateName || app.candidateId}
                    </TableCell>
                    <TableCell>{getJobTitle(app.jobId)}</TableCell>
                    <TableCell>{app.resumeFileName}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-right">
                      {app.status === "shortlisted" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={processingId === app._id}
                            onClick={() =>
                              handleStatusChange(app._id, "interview")
                            }
                          >
                            Grant Interview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                            disabled={processingId === app._id}
                            onClick={() =>
                              handleStatusChange(app._id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      )}
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
