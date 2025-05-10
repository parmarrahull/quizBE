const User = require("../models/userModel");
const Question = require("../models/questionModel");
const Answer = require("../models/answerModel");
const Result = require("../models/resultModel");

// Count Total Users
const countUsers = async (req, res) => {
    try {
        const totalUsers = await User.aggregate([{ $count: "total_users" }]);
        res.json(totalUsers);
    } catch (error) {
        res.status(500).json({ message: "Error counting users", error });
    }
};

// Get Users with Their Roles
const getUsersWithRoles = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: "roles",
                    localField: "role_id",
                    foreignField: "_id",
                    as: "user_role"
                }
            }
        ]);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users with roles", error });
    }
};

// Count Total Questions Per Quiz Type
const countQuestionsByQuizType = async (req, res) => {
    try {
        const questionCount = await Question.aggregate([
            {
                $group: {
                    _id: "$quiztype_id",
                    total_questions: { $sum: 1 }
                }
            }
        ]);
        res.json(questionCount);
    } catch (error) {
        res.status(500).json({ message: "Error counting questions", error });
    }
};

// Get Correct & Incorrect Answers Per Question
const getAnswerStats = async (req, res) => {
    try {
        const answerStats = await Answer.aggregate([
            {
                $group: {
                    _id: "$question_id",
                    correct_answers: { $sum: { $cond: [{ $eq: ["$correctanswer", "$attemptanswer"] }, 1, 0] } },
                    incorrect_answers: { $sum: { $cond: [{ $ne: ["$correctanswer", "$attemptanswer"] }, 1, 0] } }
                }
            }
        ]);
        res.json(answerStats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching answer stats", error });
    }
};

// Get User Quiz Performance
const getUserQuizPerformance = async (req, res) => {
    try {
        const userPerformance = await Result.aggregate([
            {
                $group: {
                    _id: "$user_id",
                    total_marks: { $sum: "$total_mark" },
                    attempts: { $sum: 1 }
                }
            }
        ]);
        res.json(userPerformance);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user quiz performance", error });
    }
};

module.exports = { countUsers, getUsersWithRoles, countQuestionsByQuizType, getAnswerStats, getUserQuizPerformance };