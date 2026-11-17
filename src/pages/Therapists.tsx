import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Star, Search, Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import { therapistsAPI } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { appointmentsAPI } from "@/lib/api";

interface Therapist {
  _id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  experience: string;
  nextAvailable: string;
  location: string;
  image: string;
  tags: string[];
  bio: string;
}

const Therapists = () => {
  const [search, setSearch] = useState("");
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchTherapists = async (searchQuery?: string) => {
    try {
      setLoading(true);
      const res = await therapistsAPI.getAll(searchQuery);
      setTherapists(res.data || []);
    } catch (error: any) {
      toast.error("Failed to load therapists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTherapists(search || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleBook = async (therapist: Therapist) => {
    if (!isAuthenticated) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    setBookingId(therapist._id);
    try {
      const now = new Date();
      const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const time = "10:00 AM";

      await appointmentsAPI.create({
        therapistId: therapist._id,
        date,
        time,
        type: "video",
      });

      toast.success(`Appointment booked with ${therapist.name}!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to book appointment");
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Find Your Therapist</h1>
        <p className="text-muted-foreground text-lg">
          Browse our network of licensed mental health professionals
        </p>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialty, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapists.map((therapist) => (
            <Card key={therapist._id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={therapist.image} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {therapist.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{therapist.name}</CardTitle>
                    <CardDescription>{therapist.specialty}</CardDescription>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{therapist.rating}</span>
                      <span className="text-sm text-muted-foreground">({therapist.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {therapist.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {therapist.experience} experience
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {therapist.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Next available: <span className="font-medium text-green-600">{therapist.nextAvailable}</span>
                  </div>
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={() => handleBook(therapist)}
                  disabled={bookingId === therapist._id}
                >
                  {bookingId === therapist._id ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Booking...</>
                  ) : (
                    <><Calendar className="h-4 w-4" /> Book Appointment</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && therapists.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No therapists found matching your search.</p>
          <Button variant="link" onClick={() => setSearch("")}>Clear search</Button>
        </div>
      )}
    </div>
  );
};

export default Therapists;
