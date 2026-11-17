import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Index from "@/pages/Index";
import Therapists from "@/pages/Therapists";
import Chat from "@/pages/Chat";
import Dashboard from "@/pages/Dashboard";
import RoleDashboard from "@/pages/RoleDashboard";
import TherapistDashboard from "@/pages/TherapistDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/therapists" element={<Therapists />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/dashboard" element={<RoleDashboard />} />
                <Route path="/patient/dashboard" element={<Dashboard />} />
                <Route path="/therapist/dashboard" element={<TherapistDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
