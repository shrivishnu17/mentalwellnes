import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  TrendingUp,
  Heart,
  Brain,
  Target,
  MessageCircle,
  BarChart3,
  Loader2,
  LogIn,
} from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { appointmentsAPI, chatAPI } from "@/lib/api";
import { toast } from "sonner";

interface AppointmentData {
  _id: string;
  therapistId: { _id: string; name: string; specialty: string; location?: string };
  date: string;
  time: string;
  type: string;
  status: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [chatCount, setChatCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [aptsRes, chatRes] = await Promise.all([
          appointmentsAPI.getAll(),
          chatAPI.getHistory(),
        ]);
        setAppointments(aptsRes.data || []);
        setChatCount(chatRes.data?.filter((m: any) => m.role === "user").length || 0);
      } catch (error: any) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, authLoading, navigate]);

  const handleCancelAppointment = async (id: string) => {
    try {
      await appointmentsAPI.update(id, { status: "cancelled" });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a))
      );
      toast.success("Appointment cancelled");
    } catch (error: any) {
      toast.error("Failed to cancel appointment");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground text-lg">Please sign in to view your dashboard.</p>
        <Link to="/login"><Button className="gap-2"><LogIn className="h-4 w-4" /> Sign In</Button></Link>
      </div>
    );
  }

  if (user?.role && user.role !== "patient" && user.role !== "user") {
    return <Navigate to="/dashboard" replace />;
  }

  const upcomingAppointments = appointments.filter(
    (a) => a.status !== "cancelled" && a.status !== "completed"
  );

  const wellnessMetrics = [
    { label: "Mood Score", value: "7.5/10", icon: Heart, trend: "+0.5", color: "text-pink-500" },
    { label: "Appointments", value: String(appointments.length), icon: Calendar, trend: `${upcomingAppointments.length} upcoming`, color: "text-blue-500" },
    { label: "AI Chats", value: String(chatCount), icon: MessageCircle, trend: "messages sent", color: "text-green-500" },
    { label: "Member Since", value: "Today", icon: Target, trend: "active", color: "text-orange-500" },
  ];

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Welcome Back, {user?.name?.split(" ")[0]}! 👋</h1>
        <p className="text-muted-foreground text-lg mt-1">
          Here's an overview of your wellness journey
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {wellnessMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold mt-1">{metric.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-muted-foreground">{metric.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="appointments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="appointments" className="gap-2">
            <Calendar className="h-4 w-4" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            All History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled therapy sessions</CardDescription>
                </div>
                <Link to="/therapists">
                  <Button size="sm" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Book New
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No upcoming appointments</p>
                  <Link to="/therapists">
                    <Button variant="link" className="mt-2">Book your first session</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt._id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{apt.therapistId?.name || "Therapist"}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {apt.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {apt.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={apt.status === "confirmed" ? "default" : "secondary"}>
                          {apt.status}
                        </Badge>
                        <Badge variant="outline">{apt.type === "video" ? "Video Call" : "In Person"}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleCancelAppointment(apt._id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>Complete history of your sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No appointment history yet.</p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt, i) => (
                    <div key={apt._id}>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {apt.therapistId?.name || "Therapist"} — {apt.therapistId?.specialty}
                          </p>
                          <p className="text-xs text-muted-foreground">{apt.date} at {apt.time}</p>
                        </div>
                        <Badge
                          variant={
                            apt.status === "confirmed" ? "default" :
                            apt.status === "cancelled" ? "destructive" : "secondary"
                          }
                        >
                          {apt.status}
                        </Badge>
                      </div>
                      {i < appointments.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
