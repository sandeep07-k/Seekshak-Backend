const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");
const Post = require("../models/Post");
const User = require("../models/User"); 

router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    const firebaseUid = decoded.uid;

    // ✅ Get userId from DB using firebaseUid
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // console.log("🔥 Post from:", user.userId);  // e.g., "Std-1234"
    // console.log("📝 Request body:", req.body);

    const newPost = new Post({
      userId: user.userId, // ✅ Use app-level userId
      ...req.body,
    });

    const saved = await newPost.save();
    return res.status(201).json({ message: "Post added successfully", post: saved });
  } catch (error) {
    console.error("❌ Error adding post:", error.message);
    return res.status(500).json({ message: "Error adding post", error: error.message });
  }
});

module.exports = router;
