const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
    {
        quiztype_name: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);