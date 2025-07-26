const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const User = require("../models/User");

// Ensure 'uploads' folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 🔺 POST: Upload profile image
router.post("/upload-profile", upload.single("profileImage"), async (req, res) => {
  const { firebaseUid } = req.body;

  if (!firebaseUid || !req.file) {
    return res.status(400).json({ error: "Missing firebaseUid or file" });
  }

  const imageUrl = `https://${req.get("host")}/uploads/${req.file.filename}`;


  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete old image if it exists
    if (user.profileImage) {
      const oldFilename = path.basename(user.profileImage);
      const oldFilePath = path.join(uploadsDir, oldFilename);

      if (fs.existsSync(oldFilePath)) {
        fs.unlink(oldFilePath, (err) => {
          if (err) console.warn("Failed to delete old image:", err.message);
        });
      }
    }

    // Save new image URL
    user.profileImage = imageUrl;
    await user.save();

    res.json({ message: "Image uploaded", imageUrl });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// 🔺 DELETE: Remove image
router.delete("/remove", async (req, res) => {
  const { imageUrl, firebaseUid } = req.body;

  let finalImageUrl = imageUrl;

  try {
    // If imageUrl not provided, get it from user
    if (!finalImageUrl && firebaseUid) {
      const user = await User.findOne({ firebaseUid });
      if (!user || !user.profileImage) {
        return res.status(404).json({ success: false, message: "Image not found for user" });
      }
      finalImageUrl = user.profileImage;
    }

    if (!finalImageUrl) {
      return res.status(400).json({ success: false, message: "Missing image URL" });
    }

    const filename = path.basename(finalImageUrl);
    const filepath = path.join(uploadsDir, filename);

    fs.unlink(filepath, async (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Failed to delete image" });
      }

      if (firebaseUid) {
        await User.findOneAndUpdate({ firebaseUid }, { profileImage: null });
      }

      res.json({ success: true, message: "Image deleted" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
});

module.exports = router;
