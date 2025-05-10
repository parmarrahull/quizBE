const express = require("express");
const router = express.Router();
const { calculateResult, getResult, getUserQuizHistory } = require("../controllers/resultControllers");

router.post("/submit", calculateResult);
router.get("/result/:userId/:quizId", getResult);
router.get('/history/:userId', getUserQuizHistory);

module.exports = router;