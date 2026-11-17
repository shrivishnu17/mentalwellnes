import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Calendar,
  MessageCircle,
  Shield,
  Heart,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Wellness Assistant",
      description: "Chat with our AI-powered mental wellness chatbot for immediate support and guidance.",
    },
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Book therapy sessions with licensed professionals in just a few clicks.",
    },
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your conversations and data are encrypted and completely confidential.",
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Get matched with therapists who specialize in your specific needs.",
    },
  ];

  const stats = [
    { value: "500+", label: "Licensed Therapists" },
    { value: "50K+", label: "Sessions Completed" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "AI Support" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-50/50" />
        <div className="container relative">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
              Trusted by 50,000+ users
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your Mental Wellness{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Journey Starts Here
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Connect with licensed therapists, get AI-powered support, and take control
              of your mental health with MindWell's comprehensive wellness platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/therapists">
                <Button size="lg" className="gap-2 text-base">
                  <Calendar className="h-5 w-5" />
                  Book a Session
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/chat">
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  <MessageCircle className="h-5 w-5" />
                  Try AI Chat Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              MindWell combines AI technology with professional care to provide comprehensive mental health support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Create Account", desc: "Sign up and tell us about your wellness goals." },
              { step: "2", title: "Find Your Therapist", desc: "Browse our network of licensed professionals." },
              { step: "3", title: "Start Your Journey", desc: "Book sessions and access AI support anytime." },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-gradient-to-r from-primary to-blue-600 text-white border-0">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Prioritize Your Mental Health?</h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Join thousands of people who are already on their wellness journey with MindWell.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="gap-2 text-base">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm text-white/80">
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Free AI Chat</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> No Credit Card</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Cancel Anytime</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;

