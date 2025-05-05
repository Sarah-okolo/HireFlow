
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Applications from "./pages/dashboard/Applications";
import JobPosts from "./pages/dashboard/JobPosts";
import CreateJob from "./pages/dashboard/CreateJob";
import Recruiters from "./pages/dashboard/Recruiters";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/applications" element={<Applications />} />
          <Route path="/dashboard/jobs" element={<JobPosts />} />
          <Route path="/dashboard/jobs/create" element={<CreateJob />} />
          <Route path="/dashboard/recruiters" element={<Recruiters />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;