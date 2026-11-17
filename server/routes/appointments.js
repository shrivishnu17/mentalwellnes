const express = require("express");
const { body, validationResult } = require("express-validator");
const Appointment = require("../models/Appointment");
const Therapist = require("../models/Therapist");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// All appointment routes require authentication
router.use(protect);

// @route   POST /api/appointments
// @desc    Book a new appointment
// @access  Private
router.post(
  "/",
  authorize("patient", "user"),
  [
    body("therapistId").notEmpty().withMessage("Therapist is required"),
    body("date").notEmpty().withMessage("Date is required"),
    body("time").notEmpty().withMessage("Time is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    try {
      const { therapistId, date, time, type, notes } = req.body;

      const appointment = await Appointment.create({
        userId: req.user._id,
        therapistId,
        date,
        time,
        type: type || "video",
        notes: notes || "",
      });

      const populated = await Appointment.findById(appointment._id)
        .populate("therapistId", "name specialty");

      res.status(201).json({
        success: true,
        data: populated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   GET /api/appointments
// @desc    Get user's appointments
// @access  Private
router.get("/", async (req, res) => {
  try {
    let query = { userId: req.user._id };
    if (req.user.role === "admin") {
      query = {};
    } else if (req.user.role === "therapist") {
      const therapist = await Therapist.findOne({ userId: req.user._id });
      if (!therapist) {
        return res.json({ success: true, count: 0, data: [] });
      }
      query = { therapistId: therapist._id };
    }
    const appointments = await Appointment.find(query)
      .populate("therapistId", "name specialty location")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment status
// @access  Private
router.put("/:id", async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const isPatientOwner = appointment.userId.toString() === req.user._id.toString();
    const therapist = req.user.role === "therapist"
      ? await Therapist.findOne({ userId: req.user._id })
      : null;
    const isAssignedTherapist = therapist && appointment.therapistId.toString() === therapist._id.toString();

    if (req.user.role !== "admin" && !isPatientOwner && !isAssignedTherapist) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this appointment",
      });
    }

    const { status, notes } = req.body;
    if (status) {
      if (isPatientOwner && ["patient", "user"].includes(req.user.role) && status !== "cancelled") {
        return res.status(403).json({ success: false, message: "Patients may only cancel appointments" });
      }
      appointment.status = status;
    }
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate("therapistId", "name specialty");

    res.json({
      success: true,
      data: populated,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;

