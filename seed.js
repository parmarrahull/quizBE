// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// require("dotenv").config();

// const Role = require("./models/roleModel");
// const User = require("./models/User");
// const QuizType = require("./models/quizTypeModel");
// const Question = require("./models/questionModel");
// const Answer = require("./models/answerModel");
// const Quiz = require("./models/quizModel");
// const Result = require("./models/resultModel");

// const MONGO_URI = process.env.MONGO_URI;

// // mongoose.connect("mongodb+srv://quiz:quiz123@cluster0.k3ik8in.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
// //     .then(() => console.log("MongoDB Connected Successfully!"))
// //     .catch(err => {
// //         console.error("MongoDB Connection Failed:", err);
// //         process.exit(1);
// //     });

// const DB_URL = "mongodb+srv://quiz:quiz123@cluster0.k3ik8in.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// //Database connection configuration
// mongoose.connect(DB_URL);
// const conn = mongoose.connection;
// conn.once('open', () => {
//     console.log('successfully connected to database');
// })
// conn.on('error', (err) => {
//     console.log(`failed to connect to database ${err.message}`);
// })

// const seedDatabase = async () => {
//     try {
//         await Role.deleteMany({});
//         await User.deleteMany({});
//         await QuizType.deleteMany({});
//         await Question.deleteMany({});
//         await Answer.deleteMany({});
//         await Quiz.deleteMany({});
//         await Result.deleteMany({});

//         const roles = await Role.insertMany([
//             { role_type: "Admin" },
//             { role_type: "User" }
//         ]);

//         const users = await User.insertMany([
//             {
//                 user_id: users[0]._id,
//                 firstname: "John",
//                 lastname: "Doe",
//                 phone_number: 1234567890,
//                 email: "john.doe@example.com",
//                 gender: "Male",
//                 password: "hashed_password",
//                 role_id: roles[1]._id // Assign role 'User'
//             }
//         ]);

//         const quizTypes = await QuizType.insertMany([
//             { quiztype_name: "Math" },
//             { quiztype_name: "Science" }
//         ]);

//         const questions = await Question.insertMany([
//             {
//                 question_text: "What is 2+2?",
//                 quiztype_id: quizTypes[0]._id // Math
//             }
//         ]);

//         const answers = await Answer.insertMany([
//             {
//                 question_id: questions[0]._id,
//                 correctanswer: "4",
//                 wronganswer: ["1", "3", "5"],
//                 attemptanswer: "4"
//             }
//         ]);

//         const quizzes = await Quiz.insertMany([
//             {
//                 // user_id: users[0]._id,
//                 // quiztype_name: quizTypes[0]._id,
//                 // question_id: questions[0]._id,
//                 // answer_id: answers[0]._id
//                 title: "General Knowledge Quiz",
//                 description: "A quiz to test general knowledge skills.",
//                 questions: [questions[0]._id, questions[1]._id], // Array of question IDs
//             }
//         ]);

//         await Result.insertMany([
//             // {
//             //     user_id: users[0]._id,
//             //     question_id: questions[0]._id,
//             //     total_mark: 10
//             // }
//             {
//                 user_id: users[0]._id,
//                 quiz_id: quizzes[0]._id,
//                 score: 8,
//                 total_questions: 10,
//                 correct_answers: 8,
//             },
//             {
//                 user_id: users[1]._id,
//                 quiz_id: quizzes[1]._id,
//                 score: 6,
//                 total_questions: 10,
//                 correct_answers: 6,
//             }
//         ]);

//     } catch (error) {
//         console.error("Seeding Failed:", error);
//     } finally {
//         mongoose.connection.close();
//     }
// };

// seedDatabase();