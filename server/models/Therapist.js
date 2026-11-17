const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  experience: {
    type: String,
    required: true,
  },
  nextAvailable: {
    type: String,
    default: "Today",
  },
  location: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  image: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index for search
therapistSchema.index({ name: "text", specialty: "text", tags: "text" });

module.exports = mongoose.model("Therapist", therapistSchema);

