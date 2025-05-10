const Question = require("../models/questionModel");
const mongoose = require("mongoose");

exports.getQuestionsByQuizType = async (req, res) => {
    try {
        const  quiztype_id  = req.params;
        const quiztypeObjectId = new mongoose.Types.ObjectId(quiztype_id);
        const questions = await Question.find({ quiztype_id: quiztypeObjectId });

        if (!questions || questions.length === 0) {
            return res.status(404).json({ message: "No questions found for this quiz type" });
        }

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};