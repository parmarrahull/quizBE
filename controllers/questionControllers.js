const mongoose = require("mongoose");
const Question = require("../models/questionModel");

//Create Question
exports.createQuestion = async (req, res) => {
    try {
        const { question_text, quiztype_id, options, correct_answer } = req.body;

        if (!quiztype_id || !question_text || !options || options.length < 2 || !correct_answer) {
            return res.status(400).json({ message: "All fields are required, and options must have at least 2 choices." });
        }

        if (!options.includes(correct_answer)) {
            return res.status(400).json({ message: "Correct answer must be one of the provided options." });
        }

        const newQuestion = new Question({ question_text, quiztype_id, options, correct_answer });
        await newQuestion.save();

        res.status(201).json({ message: "Question created successfully!", data: newQuestion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
    
//Get All Questions with Quiz Type
exports.getQuestions = async (req, res) => {
    try {
            const questions = await Question.aggregate([
            {
                $lookup: {
                    from: "quiztypes",
                    localField: "quiztype_id",
                    foreignField: "_id",
                    as: "quiztype"
                }
            },
            { $unwind: "$quiztype" },
            {
                $project: {
                    question_text: 1,
                    quiztype_name: "$quiztype.quiztype_name",
                    options: 1
                }
            }
        ]);

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getQuestionsByQuizType = async (req, res) => {
    try {
        const { quiztype_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(quiztype_id)) {
            return res.status(400).json({ message: "Invalid quiz type ID" });
        }

        // Perform aggregation
        const questions = await Question.aggregate([
            {
                $match: { quiztype_id: new mongoose.Types.ObjectId(quiztype_id) }
            },
            {
                $lookup: {
                    from: "quiztypes",
                    let: { quiztypeId: "$quiztype_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", { $toObjectId: "$$quiztypeId" }] } } }
                    ],
                    as: "quiztype"
                }
            },
            { $unwind: "$quiztype" },
            {
                $project: {
                    _id: 1,
                    question_text: 1,
                    quiztype_name: "$quiztype.quiztype_name",
                    options: 1
                }
            }
        ]);

        if (!questions.length) {
            return res.status(404).json({ message: "No questions found for this quiz type" });
        }

        res.status(200).json(questions);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};

//Get Questions by Quiz Type (Hiding correct_answer)
exports.getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Requested Question ID:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid question ID" });
        }

        const questionExists = await Question.findById(id);
        console.log("Question Exists:", questionExists);

        if (!questionExists) {
            return res.status(404).json({ message: "Question not found" });
        }

        const question = await Question.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: "quiztypes",
                    localField: "quiztype_id",
                    foreignField: "_id",
                    as: "quiztype"
                }
            },
            { $unwind: "$quiztype" },
            {
                $project: {
                    _id: 1,
                    question_text: 1,
                    quiztype_name: "$quiztype.quiztype_name",
                    options: 1
                }
            }
        ]);

        if (!question.length) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json(question[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};

//Update Question
exports.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { question_text, options, correct_answer } = req.body;

        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ message: "Question not found!" });
        }

        if (options && !options.includes(correct_answer)) {
            return res.status(400).json({ message: "Correct answer must be one of the provided options." });
        }

        const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json({ message: "Question updated successfully!", data: updatedQuestion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Delete Question
exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ message: "Question not found!" });
        }

        await Question.findByIdAndDelete(id);

        res.status(200).json({ message: "Question deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};