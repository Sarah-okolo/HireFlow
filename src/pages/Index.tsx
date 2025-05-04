import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useAuthStore } from "@/stores/authStore";

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <MainLayout>
      <section className="py-20">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in mx-auto max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Find Your Perfect{" "}
              <span className="bg-gradient-to-r from-hire-600 to-hire-500 bg-clip-text text-transparent">
                Career Match
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Connect with top companies and talented professionals on the most efficient hiring platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/register")}>
                Get Started
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-gradient rounded-xl p-6 text-center">
              <div className="bg-primary/10 text-primary mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Sign up as a candidate, recruiter, or company and build your professional profile.
              </p>
            </div>
            <div className="card-gradient rounded-xl p-6 text-center">
              <div className="bg-primary/10 text-primary mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Connect and Discover</h3>
              <p className="text-muted-foreground">
                Browse job opportunities or find talented candidates that match your requirements.
              </p>
            </div>
            <div className="card-gradient rounded-xl p-6 text-center">
              <div className="bg-primary/10 text-primary mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Hire or Get Hired</h3>
              <p className="text-muted-foreground">
                Streamline the recruitment process and find your perfect match efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">For Every Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4">Candidates</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span>Search and apply for jobs</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span>Track application status</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span>Receive status notifications</span>
                </li>
              </ul>
            </div>
            <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4">Recruiters</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span>Post, edit and manage jobs</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span>Review applications</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span>Track job metrics</span>
                </li>
              </ul>
            </div>
            <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4">Companies</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span>Manage recruiters</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span>View company job listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span>Accept/reject candidates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
