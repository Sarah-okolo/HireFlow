
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MainLayout } from "@/components/layouts/MainLayout";
import { UserRole, useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("candidate");
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [showCompanyIdField, setShowCompanyIdField] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle role change
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setShowCompanyIdField(newRole === "recruiter");
    if (newRole === "company") {
      setCompanyId("");
    } else if (newRole !== "recruiter") {
      setCompanyId("");
      setCompanyName("");
    }
  };

  // Generate company ID from company name
  const generateCompanyId = (name: string): string => {
    // Simplified version: take first 3 chars + random string
    const prefix = name.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 3);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${randomPart}`;
  };

  // In a real app, this would be an actual API call
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (role === "recruiter" && !companyId) {
        throw new Error("Company ID is required for recruiters");
      }

      if (role === "company" && !companyName) {
        throw new Error("Company name is required");
      }

      // Generate company ID for company role
      let finalCompanyId = companyId;
      if (role === "company") {
        finalCompanyId = generateCompanyId(companyName);
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock registration - in a real app, this would be an API call
      const userId = `user-${Math.random().toString(36).substring(2, 10)}`;
      
      // Store role in localStorage for mock login later
      localStorage.setItem(`${username}-role`, role);
      if (finalCompanyId) {
        localStorage.setItem(`${username}-companyId`, finalCompanyId);
      }

      login({
        id: userId,
        username,
        role,
        companyId: finalCompanyId || undefined
      });

      // Show welcome toast with company ID for company role
      if (role === "company") {
        toast({
          title: "Welcome to HireFlow!",
          description: `Your company has been registered successfully. Your Company ID is: ${finalCompanyId}`,
        });
      } else {
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully!",
        });
      }

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Sign up to get started with HireFlow
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => handleRoleChange(value as UserRole)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="candidate" id="candidate" />
                    <Label htmlFor="candidate" className="cursor-pointer">Candidate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recruiter" id="recruiter" />
                    <Label htmlFor="recruiter" className="cursor-pointer">Recruiter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="company" id="company" />
                    <Label htmlFor="company" className="cursor-pointer">Company</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {showCompanyIdField && (
                <div className="space-y-2">
                  <Label htmlFor="companyId">Company ID</Label>
                  <Input
                    id="companyId"
                    type="text"
                    placeholder="Enter the company ID provided to you"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    required
                  />
                </div>
              )}

              {role === "company" && (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Enter your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
