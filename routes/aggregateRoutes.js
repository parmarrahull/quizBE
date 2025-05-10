const express = require("express");
const { countUsers, getUsersWithRoles, countQuestionsByQuizType, getAnswerStats, getUserQuizPerformance } = require("../controllers/aggregateController");

const router = express.Router();

router.get("/count-users", countUsers);
router.get("/users-with-roles", getUsersWithRoles);
router.get("/questions-by-quiz-type", countQuestionsByQuizType);
router.get("/answer-stats", getAnswerStats);
router.get("/user-performance", getUserQuizPerformance);

module.exports = router;