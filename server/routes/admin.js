const express = require("express");
const User = require("../models/User");
const Therapist = require("../models/Therapist");
const Appointment = require("../models/Appointment");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(protect, authorize("admin"));

router.get("/stats", async (_req, res) => {
  try {
    const [patients, therapists, admins, appointments] = await Promise.all([
      User.countDocuments({ role: { $in: ["patient", "user"] } }),
      User.countDocuments({ role: "therapist" }),
      User.countDocuments({ role: "admin" }),
      Appointment.countDocuments(),
    ]);
    res.json({ success: true, data: { patients, therapists, admins, appointments } });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
