const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const fs = require("fs");

const User = require("../models/User");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // this must match exactly
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post("/upload-profile", upload.single("profileImage"), async (req, res) => {
  const { firebaseUid } = req.body;

  if (!firebaseUid || !req.file)
    return res.status(400).json({ error: "Missing data" });

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  try {
    const user = await User.findOne({ firebaseUid });

    // Delete old image if it exists
    if (user && user.profileImage) {
      const oldFilename = path.basename(user.profileImage);
      const oldFilePath = path.join(__dirname, "../uploads", oldFilename);
      fs.unlink(oldFilePath, (err) => {
        if (err) console.warn("Old image deletion failed:", err.message);
      });
    }

    user.profileImage = imageUrl;
    await user.save();

    res.json({ message: "Uploaded", imageUrl });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


router.delete("/remove", async (req, res) => {
  const { imageUrl, firebaseUid } = req.body;

  let finalImageUrl = imageUrl;

  if (!finalImageUrl && firebaseUid) {
    const user = await User.findOne({ firebaseUid });
    if (!user || !user.profileImage) {
      return res.status(404).json({ success: false, message: "Image not found for user" });
    }
    finalImageUrl = user.profileImage;
  }

  if (!finalImageUrl) return res.status(400).json({ success: false, message: "Missing image URL" });

  const filename = path.basename(finalImageUrl);
  const filepath = path.join(__dirname, "../uploads", filename);

  fs.unlink(filepath, async (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Failed to delete image" });
    }

    if (firebaseUid) {
      await User.findOneAndUpdate({ firebaseUid }, { profileImage: null });
    }

    res.json({ success: true, message: "Image deleted" });
  });
});

module.exports = router;
