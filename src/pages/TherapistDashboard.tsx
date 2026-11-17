import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Calendar, CheckCircle2, Clock, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { appointmentsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Appointment = {
  _id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  userId?: { name: string; email: string };
};

const TherapistDashboard = () => {
  const { user, isLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "therapist") return;
    appointmentsAPI.getAll()
      .then((response) => setAppointments(response.data || []))
      .catch(() => toast.error("Could not load appointments"))
      .finally(() => setLoading(false));
  }, [user?.role]);

  if (!isLoading && user?.role !== "therapist") return <Navigate to="/dashboard" replace />;
  if (loading || isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const pending = appointments.filter((appointment) => appointment.status === "pending").length;
  const updateStatus = async (id: string, status: "confirmed" | "completed") => {
    try {
      await appointmentsAPI.update(id, { status });
      setAppointments((current) => current.map((appointment) => appointment._id === id ? { ...appointment, status } : appointment));
      toast.success(`Appointment ${status}`);
    } catch {
      toast.error("Could not update appointment");
    }
  };

  return <div className="container py-10">
    <div className="mb-8"><h1 className="text-3xl font-bold">Therapist Dashboard</h1><p className="mt-1 text-muted-foreground">Manage your client sessions and availability.</p></div>
    <div className="mb-8 grid gap-4 sm:grid-cols-3">
      <Card><CardContent className="pt-6"><Users className="mb-2 h-5 w-5 text-primary" /><p className="text-2xl font-bold">{appointments.length}</p><p className="text-sm text-muted-foreground">Assigned sessions</p></CardContent></Card>
      <Card><CardContent className="pt-6"><Clock className="mb-2 h-5 w-5 text-amber-500" /><p className="text-2xl font-bold">{pending}</p><p className="text-sm text-muted-foreground">Awaiting confirmation</p></CardContent></Card>
      <Card><CardContent className="pt-6"><CheckCircle2 className="mb-2 h-5 w-5 text-green-600" /><p className="text-2xl font-bold">{appointments.filter((a) => a.status === "completed").length}</p><p className="text-sm text-muted-foreground">Completed sessions</p></CardContent></Card>
    </div>
    <Card><CardHeader><CardTitle>Client appointments</CardTitle><CardDescription>Only your assigned appointments appear here.</CardDescription></CardHeader><CardContent>
      {appointments.length === 0 ? <p className="py-8 text-center text-muted-foreground">No appointments are assigned to this therapist account yet.</p> : <div className="space-y-3">{appointments.map((appointment) => <div key={appointment._id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{appointment.userId?.name || "Patient"}</p><p className="text-sm text-muted-foreground">{appointment.userId?.email}</p><p className="mt-1 flex items-center gap-1 text-sm"><Calendar className="h-4 w-4" /> {appointment.date} at {appointment.time} · {appointment.type}</p></div><div className="flex items-center gap-2"><Badge>{appointment.status}</Badge>{appointment.status === "pending" && <Button size="sm" onClick={() => updateStatus(appointment._id, "confirmed")}>Confirm</Button>}{appointment.status === "confirmed" && <Button size="sm" onClick={() => updateStatus(appointment._id, "completed")}>Complete</Button>}</div></div>)}</div>}
    </CardContent></Card>
  </div>;
};

export default TherapistDashboard;
