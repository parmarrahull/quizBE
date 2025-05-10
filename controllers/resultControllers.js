const Answer = require("../models/answerModel");
const Result = require("../models/resultModel");
const Quiz = require("../models/quizModel");
const Question = require("../models/questionModel");

exports.calculateResult = async (req, res) => {
  try {
    const { userId, quizId } = req.body;
    const answers = await Answer.find({ userId, quizId });

    if (!answers.length) {
      return res.status(404).json({ message: "No answers found for this quiz." });
    }

    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalQuestions = answers.length;
    const wrongAnswers = totalQuestions - correctAnswers;
    const score = correctAnswers;
    const result = new Result({
      userId,
      quizId,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      score
    });

    await result.save();

    res.status(200).json({
      message: "Quiz result calculated successfully",
      result
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating result", error });
  }
};

// exports.getResult = async (req, res) => {
//   const { userId, quizId } = req.params;

//   console.log("Received userId:", userId);
//   console.log("Received quizId:", quizId);

//   if (!userId || !quizId) {
//     return res.status(400).json({ message: "userId and quizId are required" });
//   }

//   try {
//     const result = await Result.findOne({ userId, quizId });

//     if (!result) {
//       return res.status(404).json({ message: "Result not found" });
//     }

//     res.status(200).json({
//       totalQuestions: result.totalQuestions,
//       correctAnswers: result.correctAnswers,
//       wrongAnswers: result.wrongAnswers,
//       score: result.score,
//     });
//   } catch (err) {
//     console.error("Error fetching result:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

exports.getResult = async (req, res) => {
  const { userId, quizId } = req.params;

  if (!userId || !quizId) {
    return res.status(400).json({ message: "userId and quizId are required" });
  }

  try {
    // 1. Get all answers by user for this quiz
    const answers = await Answer.find({ userId, quizId });

    if (!answers.length) {
      return res.status(404).json({ message: "No answers found for this quiz attempt." });
    }

    // 2. Extract questionIds from answers
    const questionIds = answers.map((ans) => ans.questionId);

    // 3. Get question details
    const questions = await Question.find({ _id: { $in: questionIds } });

    // 4. Create answer breakdown
    const answerDetails = answers.map((ans) => {
      const question = questions.find((q) => q._id.toString() === ans.questionId.toString());
      return {
        questionText: question?.question_text || "Question not found",
        selectedOption: ans.selectedOption,
        correctAnswer: question?.correct_answer || "N/A",
        isCorrect: ans.isCorrect,
      };
    });

    // 5. Calculate scores
    const totalQuestions = answers.length;
    const correctAnswers = answers.filter((ans) => ans.isCorrect).length;
    const wrongAnswers = totalQuestions - correctAnswers;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // 6. Return full result
    return res.status(200).json({
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      score,
      answers: answerDetails,
    });
  } catch (err) {
    console.error("Error fetching result:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserQuizHistory = async (req, res) => {
  try {
    const { userId } = req.params;
      
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const history = await Result.find({ userId })
      .populate({
        path: 'quizId',
        select: 'quiztype_name'
      })
      .sort({ createdAt: -1 });

    if (!history || history.length === 0) {
      return res.status(404).json({ message: "No quiz history found" });
    }

    res.status(200).json(history);
  } catch (error) {
    console.error("Error in getQuizHistory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};