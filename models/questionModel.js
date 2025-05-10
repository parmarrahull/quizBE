const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question_text: { type: String, required: true },
    quiztype_id: { type: mongoose.Schema.Types.ObjectId, ref: "QuizType", required: true },
    options: { type: [String], required: true },
    correct_answer: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);