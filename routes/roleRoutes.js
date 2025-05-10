const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleControllers");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isAdmin, roleController.createRole);
router.get("/", verifyToken, isAdmin, roleController.getAllRoles);
router.get("/:id", verifyToken, isAdmin, roleController.getRoleById);
router.put("/:id", verifyToken, isAdmin, roleController.updateRole);
router.delete("/:id", verifyToken, isAdmin, roleController.deleteRole);

router.get("/admin/dashboard", verifyToken, isAdmin, (req, res) => {
    res.json({ message: "Welcome Admin!" });
});

router.get("/user/dashboard", verifyToken, (req, res) => {
    res.json({ message: "Welcome User!" });
});

// router.get("/moderator/dashboard", verifyToken, (req, res) => {
//     res.json({ message: "Welcome Moderator!" });
// });

// router.get("/admin-moderator", verifyToken, (req, res) => {
//     res.json({ message: "Weclome Admin or Moderator" });
// });

module.exports = router;