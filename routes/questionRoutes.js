const express = require("express");
const { createQuestion, getQuestions, getQuestionsByQuizType, getQuestionById, updateQuestion, deleteQuestion } = require("../controllers/questionControllers");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/questions/:id", verifyToken, isAdmin, createQuestion);
router.get("/questions", verifyToken, isAdmin, getQuestions);
router.get("/quiztype/:quiztype_id", verifyToken, getQuestionsByQuizType); //get all question
router.get("/questions/:id", verifyToken, isAdmin, getQuestionById); //get particular question according to quiztype
router.put("/questions/:id", verifyToken, isAdmin, updateQuestion); //Here in head pass quiztype_id and in url pass quetion_id get one question
router.delete("/questions/:id", verifyToken, isAdmin, deleteQuestion);

module.exports = router;