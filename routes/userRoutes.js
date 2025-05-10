const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/users", verifyToken, isAdmin, userController.getAllUsers);
router.get("/user/:id", verifyToken, isAdmin, userController.getUserById);
router.put("/user/:id", verifyToken, userController.updateUser);
router.delete("/user/:id", verifyToken, isAdmin, userController.deleteUser);

module.exports = router;