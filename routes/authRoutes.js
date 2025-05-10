const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password, gender, phone_number, role } = req.body;

  try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({ firstname, lastname, email, password: hashedPassword, gender, phone_number, role });
      await user.save();

      res.status(201).json({ message: "User Registered" });
  } catch (error) {
      res.status(400).json({ message: "Error Registering User" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "10h" });

    res.json({
      token,
      role: user.role,
      user: {
        userId: user._id,
        firstname: user.firstname,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
