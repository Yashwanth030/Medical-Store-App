const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// @desc Register user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password });


    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
};

// @desc Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Login request received:", email, password);

  const user = await User.findOne({ email });

  if (!user) {
    console.log("❌ No user found with email:", email);
    return res.status(401).json({ message: "Invalid email or password" });
  }

  console.log("✅ User found:", user.email);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("🔍 Password match:", isMatch);

  if (!isMatch) {
    console.log("❌ Password mismatch");
    return res.status(401).json({ message: "Invalid email or password" });
  }

  console.log("✅ Login successful");

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};



// @desc Get user profile
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
