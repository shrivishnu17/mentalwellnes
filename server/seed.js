require("dotenv").config();
const mongoose = require("mongoose");
const Therapist = require("./models/Therapist");
const connectDB = require("./config/db");

const therapists = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    rating: 4.9,
    reviews: 127,
    experience: "12 years",
    nextAvailable: "Today",
    location: "New York, NY",
    tags: ["CBT", "Mindfulness", "Anxiety"],
    bio: "Dr. Johnson specializes in cognitive behavioral therapy for anxiety and depression. She has helped hundreds of patients develop healthy coping mechanisms.",
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Relationship Counseling",
    rating: 4.8,
    reviews: 98,
    experience: "8 years",
    nextAvailable: "Tomorrow",
    location: "San Francisco, CA",
    tags: ["Couples", "Family", "Communication"],
    bio: "Dr. Chen focuses on improving communication and emotional connection in relationships. He uses evidence-based approaches for couples and family therapy.",
  },
  {
    name: "Dr. Emily Williams",
    specialty: "Stress Management",
    rating: 4.9,
    reviews: 156,
    experience: "15 years",
    nextAvailable: "Today",
    location: "Chicago, IL",
    tags: ["Stress", "Burnout", "Work-Life Balance"],
    bio: "Dr. Williams is an expert in workplace stress and burnout prevention. She helps professionals find sustainable work-life balance.",
  },
  {
    name: "Dr. James Rodriguez",
    specialty: "Trauma & PTSD",
    rating: 4.7,
    reviews: 84,
    experience: "10 years",
    nextAvailable: "Wed, Nov 18",
    location: "Austin, TX",
    tags: ["EMDR", "Trauma", "PTSD"],
    bio: "Dr. Rodriguez is trained in EMDR and specializes in trauma recovery. He provides a safe space for processing difficult experiences.",
  },
  {
    name: "Dr. Priya Patel",
    specialty: "Youth & Adolescent",
    rating: 4.8,
    reviews: 112,
    experience: "9 years",
    nextAvailable: "Tomorrow",
    location: "Seattle, WA",
    tags: ["Teens", "ADHD", "Self-Esteem"],
    bio: "Dr. Patel works with children and adolescents, helping them navigate challenges like ADHD, self-esteem issues, and social anxiety.",
  },
  {
    name: "Dr. David Kim",
    specialty: "Addiction Recovery",
    rating: 4.9,
    reviews: 143,
    experience: "14 years",
    nextAvailable: "Today",
    location: "Los Angeles, CA",
    tags: ["Addiction", "Recovery", "12-Step"],
    bio: "Dr. Kim has over a decade of experience in addiction recovery, combining 12-step facilitation with modern therapeutic approaches.",
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    
    // Clear existing therapists
    await Therapist.deleteMany({});
    console.log("Cleared existing therapists");

    // Insert seed data
    const created = await Therapist.insertMany(therapists);
    console.log(`Seeded ${created.length} therapists`);

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedDB();

