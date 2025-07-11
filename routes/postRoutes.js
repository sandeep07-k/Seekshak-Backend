const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");
const Post = require("../models/Posts");

// POST /api/posts/add
router.post("/add", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) return res.status(401).json({ message: "Unauthorized: No token" });

    const decoded = await admin.auth().verifyIdToken(token);
    const userId = decoded.uid;

    const newPost = new Post({
      userId,
      ...req.body
    });

    await newPost.save();
    res.status(201).json({ message: "Post added successfully", post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
