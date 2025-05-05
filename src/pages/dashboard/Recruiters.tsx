
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuthStore } from "@/stores/authStore";
import { getUsersByCompany, removeRecruiterFromCompany } from "@/utils/mockApi";
import { toast } from "@/hooks/use-toast";

export default function Recruiters() {
  const { user } = useAuthStore();
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'company' && user.companyId) {
      loadRecruiters();
    }
  }, [user]);

  const loadRecruiters = () => {
    if (!user?.companyId) return;
    const companyRecruiters = getUsersByCompany(user.companyId);
    setRecruiters(companyRecruiters);
  };

  const handleRemoveRecruiter = async (recruiterId: string) => {
    if (window.confirm("Are you sure you want to remove this recruiter?")) {
      setIsLoading(true);
      try {
        const success = removeRecruiterFromCompany(recruiterId);
        if (success) {
          toast({
            title: "Recruiter removed",
            description: "The recruiter has been removed from your company",
          });
          // Update state to remove the recruiter
          setRecruiters(recruiters.filter(r => r.id !== recruiterId));
        } else {
          toast({
            title: "Error",
            description: "Failed to remove recruiter",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove recruiter",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Company Recruiters</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recruiters</CardTitle>
            <CardDescription>
              Manage the recruiters in your company
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recruiters.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recruiters in your company yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recruiters.map((recruiter) => (
                    <TableRow key={recruiter.id}>
                      <TableCell className="font-medium">{recruiter.username}</TableCell>
                      <TableCell>{recruiter.id}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleRemoveRecruiter(recruiter.id)}
                          disabled={isLoading}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
