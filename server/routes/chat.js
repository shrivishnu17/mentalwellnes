const express = require("express");
const { body, validationResult } = require("express-validator");
const ChatMessage = require("../models/ChatMessage");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All chat routes require authentication
router.use(protect);

// AI response generator
function getAIResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes("anxiety") || lower.includes("anxious") || lower.includes("worry")) {
    return "Managing anxiety involves several strategies:\n\n• **Deep Breathing**: Try the 4-7-8 technique — breathe in for 4 seconds, hold for 7, exhale for 8.\n• **Grounding**: Use the 5-4-3-2-1 method — notice 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.\n• **Regular Exercise**: Even 20 minutes of walking can significantly reduce anxiety.\n• **Limit Caffeine**: It can worsen anxiety symptoms.\n\nWould you like me to go deeper on any of these techniques?";
  }
  if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("tired")) {
    return "Here are evidence-based tips for better sleep:\n\n• **Consistent Schedule**: Go to bed and wake up at the same time daily.\n• **Screen-Free Wind Down**: Avoid screens 1 hour before bed.\n• **Cool Room**: Keep your bedroom around 65–68°F (18–20°C).\n• **Relaxation Routine**: Try progressive muscle relaxation or gentle stretching.\n• **Avoid Late Meals**: Don't eat heavy meals within 2–3 hours of bedtime.\n\nWould you like a personalized sleep routine?";
  }
  if (lower.includes("stress") || lower.includes("work") || lower.includes("burnout")) {
    return "Here are effective strategies for managing work stress:\n\n• **Set Boundaries**: Define clear work hours and stick to them.\n• **Prioritize Tasks**: Use the Eisenhower Matrix — urgent/important vs. not.\n• **Take Breaks**: Follow the Pomodoro Technique — 25 min work, 5 min break.\n• **Talk About It**: Share your feelings with a trusted colleague or therapist.\n• **Physical Activity**: Regular exercise is one of the best stress relievers.\n\nShall I help you create a stress management plan?";
  }
  if (lower.includes("mindful") || lower.includes("meditat") || lower.includes("calm")) {
    return "Great choice! Here are beginner-friendly mindfulness techniques:\n\n• **Body Scan Meditation**: Slowly focus attention on each part of your body, from toes to head.\n• **Mindful Breathing**: Simply observe your breath without trying to change it.\n• **Mindful Walking**: Pay attention to each step, the sensation of your feet on the ground.\n• **Gratitude Practice**: Write down 3 things you're grateful for each day.\n• **5-Minute Meditation**: Start with just 5 minutes of sitting quietly and focusing on your breath.\n\nWould you like a guided meditation exercise?";
  }
  if (lower.includes("depress") || lower.includes("sad") || lower.includes("hopeless")) {
    return "I hear you, and I want you to know that your feelings are valid. Here are some steps that may help:\n\n• **Reach Out**: Talk to someone you trust — a friend, family member, or therapist.\n• **Small Steps**: Set one small, achievable goal each day.\n• **Routine**: Try to maintain a daily routine, even a simple one.\n• **Physical Activity**: Even a short walk can help lift mood.\n• **Professional Help**: Consider booking a session with one of our licensed therapists.\n\n⚠️ If you're in crisis, please contact the 988 Suicide & Crisis Lifeline (call or text 988).\n\nWould you like me to help you find a therapist?";
  }

  return "Thank you for sharing. I'm here to help with your mental wellness journey. I can assist with topics like **anxiety management**, **sleep improvement**, **stress relief**, **mindfulness techniques**, and more.\n\nFeel free to ask me anything, or try one of the suggested topics. Remember, for serious concerns, I'd recommend booking a session with one of our licensed therapists.";
}

// @route   POST /api/chat
// @desc    Send a message and get AI response
// @access  Private
router.post(
  "/",
  [body("content").trim().notEmpty().withMessage("Message content is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    try {
      const { content } = req.body;

      // Save user message
      const userMessage = await ChatMessage.create({
        userId: req.user._id,
        role: "user",
        content,
      });

      // Generate and save AI response
      const aiContent = getAIResponse(content);
      const aiMessage = await ChatMessage.create({
        userId: req.user._id,
        role: "assistant",
        content: aiContent,
      });

      res.status(201).json({
        success: true,
        data: {
          userMessage,
          aiMessage,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   GET /api/chat
// @desc    Get user's chat history
// @access  Private
router.get("/", async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.user._id }).sort({
      createdAt: 1,
    });

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;

