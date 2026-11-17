import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Calendar, ShieldCheck, Stethoscope, Users, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Stats = { patients: number; therapists: number; admins: number; appointments: number };
const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => { if (user?.role === "admin") adminAPI.getStats().then((response) => setStats(response.data || null)).catch(() => toast.error("Could not load platform statistics")); }, [user?.role]);
  if (!isLoading && user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  if (isLoading || !stats) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  const cards = [{ label: "Patients", value: stats.patients, icon: Users }, { label: "Therapists", value: stats.therapists, icon: Stethoscope }, { label: "Appointments", value: stats.appointments, icon: Calendar }, { label: "Administrators", value: stats.admins, icon: ShieldCheck }];
  return <div className="container py-10"><div className="mb-8"><h1 className="text-3xl font-bold">Admin Dashboard</h1><p className="mt-1 text-muted-foreground">A secure overview of the MindWell platform.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="pt-6"><Icon className="mb-3 h-6 w-6 text-primary" /><p className="text-3xl font-bold">{value}</p><p className="text-sm text-muted-foreground">{label}</p></CardContent></Card>)}</div><Card className="mt-8"><CardHeader><CardTitle>Role management</CardTitle><CardDescription>Admin accounts can access platform-wide statistics. Therapist accounts must be linked to a therapist profile before assigned appointments appear.</CardDescription></CardHeader></Card></div>;
};
export default AdminDashboard;
