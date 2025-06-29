const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { getUserProfile } = require("../controllers/userController");

// @route   POST /api/users/register
router.post("/register", registerUser);

router.get("/profile", protect, getUserProfile);
// @route   POST /api/users/login
router.post("/login", loginUser);

module.exports = router;
