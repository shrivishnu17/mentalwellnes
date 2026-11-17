const express = require("express");
const Therapist = require("../models/Therapist");

const router = express.Router();

// @route   GET /api/therapists
// @desc    Get all therapists (with optional search)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const regex = new RegExp(search, "i");
      query = {
        $or: [
          { name: regex },
          { specialty: regex },
          { tags: regex },
          { location: regex },
        ],
      };
    }

    const therapists = await Therapist.find(query).sort({ rating: -1 });

    res.json({
      success: true,
      count: therapists.length,
      data: therapists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/therapists/:id
// @desc    Get single therapist
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }

    res.json({
      success: true,
      data: therapist,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;

