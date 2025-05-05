import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/hooks/use-toast";
import {axiosPrivate} from "@/lib/axiosPrivate"; // ✅ Axios instance

export default function Recruiters() {
  const { user } = useAuthStore();
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.role === "company" && user.companyId) {
      loadRecruiters();
    }
  }, [user]);

  const loadRecruiters = async () => {
    try {
      const { data } = await axiosPrivate.get(`/users?companyId=${user.companyId}`);
      setRecruiters(data);
    } catch (error) {
      console.error("Failed to load recruiters", error);
      toast({
        title: "Error",
        description: "Could not load recruiters",
        variant: "destructive",
      });
    }
  };

  const handleRemoveRecruiter = async (recruiterId: string) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this recruiter?"
    );
    if (!confirm) return;

    setIsLoading(true);
    try {
      await axiosPrivate.delete(`/recruiters/${recruiterId}`);

      toast({
        title: "Recruiter removed",
        description: "The recruiter has been removed from your company",
      });

      setRecruiters((prev) =>
        prev.filter((recruiter) => recruiter.id !== recruiterId)
      );
    } catch (error) {
      console.error("Failed to remove recruiter", error);
      toast({
        title: "Error",
        description: "Failed to remove recruiter",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Company Recruiters
          </h1>
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
                <p className="text-muted-foreground">
                  No recruiters in your company yet.
                </p>
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
                      <TableCell className="font-medium">
                        {recruiter.username}
                      </TableCell>
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