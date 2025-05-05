
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Application, 
  Job,  
  getJobById, 
  updateApplicationStatus 
} from "@/utils/mockApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface ShortlistedApplicationsListProps {
  applications: Application[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplicationUpdated?: () => void;
}

export function ShortlistedApplicationsList({ 
  applications, 
  open, 
  onOpenChange,
  onApplicationUpdated 
}: ShortlistedApplicationsListProps) {
  const [processing, setProcessing] = useState<boolean>(false);

  const handleStatusChange = async (applicationId: string, status: Application['status']) => {
    setProcessing(true);
    try {
      const updated = updateApplicationStatus(applicationId, status);
      if (updated) {
        toast({
          title: "Status updated",
          description: `Application status changed to ${status}`,
        });
        if (onApplicationUpdated) {
          onApplicationUpdated();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Shortlisted</Badge>;
      case 'interview':
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Interview</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getJobTitle = (jobId: string) => {
    const job = getJobById(jobId);
    return job ? job.title : "Unknown Job";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Shortlisted Applications</DialogTitle>
          <DialogDescription>
            Review shortlisted candidates and decide whether to grant interviews or reject.
          </DialogDescription>
        </DialogHeader>

        {applications.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No shortlisted applications available.</p>
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
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.candidateName || application.candidateId}</TableCell>
                    <TableCell>{getJobTitle(application.jobId)}</TableCell>
                    <TableCell>{application.resumeFileName}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {application.status === 'shortlisted' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(application.id, 'interview')}
                              disabled={processing}
                            >
                              Grant Interview
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500"
                              onClick={() => handleStatusChange(application.id, 'rejected')}
                              disabled={processing}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
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
