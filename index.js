const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv");
const connectDB = require("./connect");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("./models/User");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();

// ✅ Define CORS options BEFORE using it
const corsOptions = {
  origin: [
    "https://YOUR-FRONTEND-DOMAIN.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// ✅ Apply CORS middleware FIRST
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ✅ Core Middleware
app.use(express.json());
app.use(passport.initialize());

// ✅ Passport JWT Strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");
const quizRoutes = require("./routes/quizRoutes");
const resultRoutes = require("./routes/resultRoutes");
const roleRoutes = require("./routes/roleRoutes");
const quizTypeRoutes = require("./routes/quizTypeRoutes");
const userRoutes = require("./routes/userRoutes");

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/quiz-types", quizTypeRoutes);
app.use("/api/user", userRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Protected example
app.get(
  "/api/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "You accessed a protected route!", user: req.user });
  }
);

// ✅ For local dev
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running locally on http://localhost:${PORT}`)
  );
}

// ✅ Export for Vercel serverless
module.exports = app;
