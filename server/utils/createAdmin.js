const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const connectDB = require("../config/db");

dotenv.config(); // ✅ Load environment variables

const createAdmin = async () => {
  try {
    await connectDB(); // ✅ Connect to MongoDB

    const existingAdmin = await User.findOne({ email: "srikanta@gmail.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists:", existingAdmin.email);
    } else {
      const adminUser = new User({
        name: "Srikanta",
        email: "srikanta@gmail.com",
        password: "Srikanta", // ✅ Plain password only
        role: "admin",
      });

      await adminUser.save(); // Mongoose will hash it
      console.log("✅ Admin user created successfully");
    }

    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
};

createAdmin();
