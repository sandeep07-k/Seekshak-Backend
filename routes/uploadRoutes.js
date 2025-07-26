const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const User = require("../models/User");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post("/upload-profile", upload.single("profileImage"), async (req, res) => {
  try {
    const { firebaseUid } = req.body;
    if (!firebaseUid || !req.file) return res.status(400).json({ error: "Missing data" });

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { profileImage: imageUrl },
      { new: true }
    );

    res.json({ message: "Uploaded", imageUrl });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.delete("/remove", (req, res) => {
  const imageUrl = req.body.imageUrl; // frontend will send full URL

  if (!imageUrl) return res.status(400).json({ success: false, message: "Missing image URL" });

  const filename = path.basename(imageUrl); // extract abc123.jpg
  const filepath = path.join(__dirname, "../uploads", filename);

  fs.unlink(filepath, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Failed to delete image" });
    }
    res.json({ success: true, message: "Image deleted" });
  });
});
module.exports = router;
