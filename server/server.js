const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");

const orderRoutes = require("./routes/orderRoutes");
// Route Imports
const userRoutes = require('./routes/userRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = require("./config/db");
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/api/upload", uploadRoutes);
// Routes
app.use("/api/users", userRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Optional future routes
// app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/orders", orderRoutes);
// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
