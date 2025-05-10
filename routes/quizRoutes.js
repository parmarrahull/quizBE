const express = require("express");
const { getQuestionsByQuizType } = require("../controllers/quizControllers");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Get questions for a specific quiz type
router.get("/quizzes/:id", verifyToken, getQuestionsByQuizType);

module.exports = router;