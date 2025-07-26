const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');


const fs = require('fs');
const imagePath = path.join(__dirname, 'uploads', imageName);
if (fs.existsSync(imagePath)) {
  fs.unlinkSync(imagePath);
} else {
  console.log("Image does not exist:", imagePath);
}



// Load env vars
dotenv.config();

// Firebase & MongoDB config
const admin = require("./config/firebase");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const locationRoutes = require('./routes/locationRoutes');
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to DB
connectDB();

// Use Routes
app.use("/api/auth", authRoutes);
app.use('/api/location', locationRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/image", require("./routes/uploadRoutes"));





// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
