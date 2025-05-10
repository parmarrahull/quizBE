const Answer = require("../models/answerModel");
const Question = require("../models/questionModel");
const Result = require("../models/resultModel");

exports.submitAnswers = async (req, res) => {
  const { userId, quizId, answers } = req.body;
  if (!userId || !quizId || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid request payload' });
  }
    try {
      console.log("Received data:", req.body);
  
      const answerDocs = [];
  
      for (const ans of answers) {
        const question = await Question.findById(ans.questionId);
        console.log(`Question found for ID ${ans.questionId}:`, question);
  
        if (!question) {
          return res.status(404).json({
            message: `Question with ID ${ans.questionId} not found`,
          });
        }
  
        const isCorrect = question.correct_answer === ans.selectedOption;
        console.log(`Selected: ${ans.selectedOption}, Correct: ${question.correct_answer}, isCorrect: ${isCorrect}`);
  
        answerDocs.push({
          userId,
          quizId,
          questionId: ans.questionId,
          selectedOption: ans.selectedOption,
          isCorrect,
        });
      }

      console.log("Answer docs to insert:", answerDocs);
      await Answer.insertMany(answerDocs);
      res.status(200).json({ message: "Answers submitted successfully" });
      answers: answerDocs;
    } catch (error) {
      console.error("Error submitting answers:", error);
      res.status(500).json({ message: "Error submitting answers", error });
    }
  };

// exports.submitAnswers = async (req, res) => {
//   try {
//     const { userId, quizId, answers } = req.body;

//     // Check if result already exists for the specific user and quiz
//     const existingResult = await Result.findOne({ userId, quizId });
    
//     // If result already exists, return a message indicating the quiz was already attempted
//     if (existingResult) {
//       return res.status(400).json({ message: "You have already attempted this quiz." });
//     }

//     // Save each answer and calculate correctness
//     const savedAnswers = await Promise.all(
//       answers.map(async (ans) => {
//         const correctQuestion = await Question.findById(ans.questionId);

//         if (!correctQuestion) {
//           throw new Error(`Question with ID ${ans.questionId} not found`);
//         }

//         // Ensure the correctOption exists and is a valid string
//         const correctOption = correctQuestion.correctOption ? correctQuestion.correctOption.trim().toLowerCase() : null;
//         const selectedOption = ans.selectedOption ? ans.selectedOption.trim().toLowerCase() : null;

//         // Debugging logs for comparison
//         console.log(`Correct Option: "${correctOption}", Selected Option: "${selectedOption}"`);

//         // Check if the selectedOption matches the correctOption, and ensure it returns a boolean
//         const isCorrect = correctOption && selectedOption ? correctOption === selectedOption : false;

//         // Debugging log for isCorrect value
//         console.log(`isCorrect: ${isCorrect}`);

//         // Save the answer
//         const answer = new Answer({
//           userId,
//           quizId,
//           questionId: ans.questionId,
//           selectedOption: ans.selectedOption,
//           isCorrect: isCorrect,  // Ensure isCorrect is set as a boolean value
//         });

//         return await answer.save();  // Save each answer
//       })
//     );

//     // Calculate result
//     const correctCount = savedAnswers.filter(a => a.isCorrect).length;
//     const totalQuestions = savedAnswers.length;
//     const wrongCount = totalQuestions - correctCount;

//     // Save result
//     const result = new Result({
//       userId,
//       quizId,
//       totalQuestions,
//       correctAnswers: correctCount,
//       wrongAnswers: wrongCount,
//       score: correctCount,
//     });

//     await result.save();

//     // Send response
//     res.status(200).json({
//       message: "Answers submitted successfully",
//       answers: savedAnswers,  // Return the saved answers along with correctness
//     });

//   } catch (error) {
//     console.error("Submit Answer Error:", error);  // Log error
//     res.status(500).json({ message: "Error submitting answers", error: error.message });
//   }
// };