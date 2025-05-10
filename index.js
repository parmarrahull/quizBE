const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv");
const connectDB = require("./connect");
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");
const quizRoutes = require("./routes/quizRoutes");
const resultRoutes = require("./routes/resultRoutes");
const roleRoutes = require("./routes/roleRoutes");
const quizTypeRoutes = require("./routes/quizTypeRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
const User = require("./models/User");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const cors = require("cors");

const app = express();
 

// Setup CORS
const corsOptions = {
  origin: ["https://quiz-fe-phi.vercel.app", "http://localhost:3000"], // ✅ Update this
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Allow preflight


// Load env vars
dotenv.config();
connectDB();

// Middleware
app.use(express.json());
app.use(passport.initialize());
require("./config/passport");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/quiz-types", quizTypeRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
res.send("API is running.....");
});

// Ensure ExtractJwt is defined before using it
const opts = 
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET, // Ensure this is set in .env
    };

// Configure Passport with JWT Strategy
passport.use
(
    new JwtStrategy(opts, async (jwt_payload, done) => {
    try
    {
        const user = await User.findById(jwt_payload.id);
    if (user)
    {
        return done(null, user);
    }
    return done(null, false);
    }
    catch (err)
    {
        return done(err, false);
    }
})
);

// Protected Route Example
app.get("/api/protected", passport.authenticate("jwt", { session: false }), (req, res) => {
res.json({ message: "You accessed a protected route!", user: req.user });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
