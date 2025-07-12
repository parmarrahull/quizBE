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
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const cors = require("cors");
const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();

// ✅ Define CORS options before use
const corsOptions = {
  origin: [
    "https://quiz-ui-xyz.vercel.app",  // <-- replace with your real frontend domain
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ✅ Apply CORS middleware correctly
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ✅ Core Middleware
app.use(express.json());
app.use(passport.initialize());
require("./config/passport");

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/quiz-types", quizTypeRoutes);
app.use("/api/user", userRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("API is running.....");
});

// ✅ Passport Strategy
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

// ✅ Protected Example
app.get(
  "/api/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "You accessed a protected route!", user: req.user });
  }
);

// ✅ Serverless export for Vercel
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running locally on http://localhost:${PORT}`));
}

module.exports = app;
