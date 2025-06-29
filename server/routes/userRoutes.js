const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @route   POST /api/users/register
router.post("/register", registerUser);

// @route   POST /api/users/login
router.post("/login", loginUser);

// @route   POST /api/users/forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email, username, newPassword } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email }, { name: username }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password" });
  }
});
router.post("/add-medicine", protect, adminOnly, (req, res) => {
  res.json({ message: "Medicine added!" });
});

// @route GET /api/users/profile
router.get("/profile", protect, getUserProfile);

module.exports = router;
