require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
// app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auth", (req, res, next) => {
    console.log("Auth Routes Hit");
    next();
}, require("./routes/authRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
