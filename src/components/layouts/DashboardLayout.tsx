
import { ReactNode } from "react";
import { Header } from "./Header";
import { useAuthStore } from "@/stores/authStore";
import { Link, Navigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Briefcase, Users, User, Settings } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const navigation = {
    candidate: [
      { name: "Job Board", path: "/dashboard", icon: <Briefcase size={18} /> },
      { name: "My Applications", path: "/dashboard/applications", icon: <Briefcase size={18} /> },
      { name: "Profile", path: "/dashboard/profile", icon: <User size={18} /> },
      { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
    ],
    recruiter: [
      { name: "Dashboard", path: "/dashboard", icon: <Briefcase size={18} /> },
      { name: "My Job Posts", path: "/dashboard/jobs", icon: <Briefcase size={18} /> },
      { name: "Create Job", path: "/dashboard/jobs/create", icon: <Briefcase size={18} /> },
      { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
    ],
    company: [
      { name: "Dashboard", path: "/dashboard", icon: <Briefcase size={18} /> },
      { name: "Job Posts", path: "/dashboard/jobs", icon: <Briefcase size={18} /> },
      { name: "Recruiters", path: "/dashboard/recruiters", icon: <Users size={18} /> },
      { name: "Applications", path: "/dashboard/applications", icon: <Briefcase size={18} /> },
      { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
    ],
  };

  const roleNavigation = user?.role ? navigation[user.role] : navigation.candidate;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 py-8">
        <aside className="hidden md:flex flex-col gap-2 h-[calc(100vh-8rem)] sticky top-24">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Menu
            </h2>
            <div className="space-y-1">
              {roleNavigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                    location.pathname === item.path
                      ? "bg-accent text-accent-foreground"
                      : "transparent"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
      <footer className="border-t py-6 bg-muted/40">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} HireFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
