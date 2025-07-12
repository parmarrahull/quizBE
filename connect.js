const mongoose = require('mongoose');
require("dotenv").config();

const MONGO_URI = "mongodb+srv://quiz:quiz123@cluster0.k3ik8in.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 

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