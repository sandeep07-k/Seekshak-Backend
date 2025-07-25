const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");
const Post = require("../models/Post");
const User = require("../models/User");
const moment = require("moment");

// Add Post
router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized: No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    const firebaseUid = decoded.uid;

    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const todayFormatted = moment().format("DD-MM-YYYY");

    // Extract location fields
    const {
      latitude,
      longitude,
      sublocality,
      area,
      city,
      state,
      country,
      ...restBody
    } = req.body;

    const newPost = new Post({
      userId: user.userId,
      postedDate: todayFormatted,

      ...restBody,

      latitude,
      longitude,
      sublocality,
      area,
      city,
      state,
      country,

      // ✅ Convert to GeoJSON format
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
    });

    const saved = await newPost.save();
    res.status(201).json({ message: "Post added successfully", post: saved });
  } catch (error) {
    console.error("❌ Error adding post:", error.message);
    res.status(500).json({ message: "Error adding post", error: error.message });
  }
});


// Auto-expire posts older than 60 days
const expireOldPosts = async () => {
  const expiryDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 60 days ago
  await Post.updateMany(
    { createdAt: { $lt: expiryDate }, status: "active" },
    { $set: { status: "expired" } }
  );
};

// Get My Posts with auto-expire
router.get("/my-posts", async (req, res) => {
  try {
    await expireOldPosts(); // auto-expire logic

    const { userId, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(posts); // 👈 returns raw array of posts
  } catch (err) {
    console.error("Error getting posts:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// Reactivate post
router.post("/reactivate-post/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.status = "active";
    post.createdAt = new Date();
    post.postedDate = moment().format("DD-MM-YYYY");
    await post.save();

    res.json({ success: true, message: "Post reactivated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mark as Filled
router.post("/mark-filled/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.status = "filled";
    await post.save();

    res.json({ success: true, message: "Post marked as filled" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete Post
router.delete("/delete-post/:postId", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/update-post/:postId", async (req, res) => {
  try {
    const postId = req.params.postId.trim();

    const {
      latitude,
      longitude,
      ...restBody
    } = req.body;

    // Add GeoJSON location if lat/lon provided
    if (latitude && longitude) {
      restBody.location = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
      restBody.latitude = latitude;
      restBody.longitude = longitude;
    }

    const updated = await Post.findByIdAndUpdate(postId, restBody, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});




module.exports = router;
