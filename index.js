const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Load env vars
dotenv.config();

// Firebase & MongoDB config
const admin = require("./config/firebase");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const imageRoutes = require("./routes/uploadRoutes");

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
connectDB();
const fs = require("fs");
const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/image", imageRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
