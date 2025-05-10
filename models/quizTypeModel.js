const mongoose = require('mongoose');

const quizTypeSchema = new mongoose.Schema({
    quiztype_name: { type: String, required: true, unique: true},
    questions : [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
}, { timestamps: true});

module.exports = mongoose.model("QuizType", quizTypeSchema);