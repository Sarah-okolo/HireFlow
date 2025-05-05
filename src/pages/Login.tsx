import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { useLoginMutation } from "@/hooks/useLoginMutation"; // ✅ your new hook

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { mutate: loginMutate, isPending } = useLoginMutation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    loginMutate(
      { username, password },
      {
        onSuccess: (data) => {
          Cookies.set("token", data.token, { expires: 7 });

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
        },
        onError: (err: any) => {
          toast({
            title: "Login failed",
            description: err?.response?.data?.error || "Something went wrong",
            variant: "destructive",
          });
        },
      }
    );
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
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Logging in..." : "Login"}
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