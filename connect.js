const mongoose = require('mongoose');
require("dotenv").config();

const MONGO_URI = "mongodb://127.0.0.1:27017/QuizDatabase"; 

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
}

module.exports = connectDB;