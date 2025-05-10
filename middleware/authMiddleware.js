const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(403).json({ error: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }
};

// Middleware to allow only Admins
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden: Admins Only" });
    next();
};

module.exports = { verifyToken, isAdmin };