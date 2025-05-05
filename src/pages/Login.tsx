
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore, UserRole } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const body = {
        username,
        password,
      };

      console.log("Login request body:", body);

      const response = await fetch("https://hireflow-server-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.log('error:', data);
        throw new Error(data.error || "Login failed");
      }
  
      // Set token to cookie
      Cookies.set("token", data.token, { expires: 7 }); // Expires in 7 days
  
      // Pass user data to your auth store
      login({
        id: data.user._id,
        username: data.user.username,
        role: data.user.role,
        companyId: data.user.companyId,
      });
  
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${data.user.username}!`,
      });
  
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
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
            <CardTitle className="text-2xl font-bold">Login to HireFlow</CardTitle>
            <CardDescription>Enter your credentials to sign in</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Sign Up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
