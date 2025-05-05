import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MainLayout } from "@/components/layouts/MainLayout";
import { UserRole, useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { useRegisterMutation } from "@/hooks/useRegisterMutation";

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

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setShowCompanyIdField(newRole === "recruiter");
    if (newRole !== "recruiter") setCompanyId("");
    if (newRole !== "company") setCompanyName("");
  };

  const { mutateAsync: registerMutation } = useRegisterMutation();

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (role === "recruiter" && !companyId) {
      throw new Error("Company ID is required for recruiters.");
    }

    if (role === "company" && !companyName) {
      throw new Error("Company name is required.");
    }

    const payload = {
      username,
      password,
      role,
      ...(role === "recruiter" && { companyId }),
      ...(role === "company" && { companyName }),
    };

    const data = await registerMutation(payload);

    Cookies.set("token", data.token, { expires: 7 });

    login({
      id: data.user._id,
      username: data.user.username,
      role: data.user.role as UserRole,
      companyId: data.user.companyId,
    });

    toast({
      title: "Welcome to HireFlow!",
      description:
        role === "company"
          ? `Your company was registered. Company ID: ${data.user.companyId}`
          : "Your account has been created successfully!",
    });

    navigate("/dashboard");
  } catch (error) {
    toast({
      title: "Registration failed",
      description:
        error instanceof Error ? error.message : "Something went wrong",
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
                    placeholder="Enter your company ID"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Don't have a company ID? Register your company on the platform to receive one.</p>
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