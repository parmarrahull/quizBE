const express = require("express");
const { createQuizType, getQuizTypes, getQuizTypeById, updateQuizType, deleteQuizType} = require("../controllers/quizTypecontroller");
const { verifyToken, isAdmin }  = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/quiz-types", verifyToken, isAdmin, createQuizType);
router.get("/quiz-types", verifyToken, getQuizTypes);
router.get("/quiz-types/:id", verifyToken, getQuizTypeById);
router.put("/quiz-types/:id", verifyToken, isAdmin, updateQuizType);
router.delete("/quiz-types/:id", verifyToken, isAdmin, deleteQuizType);

module.exports = router;