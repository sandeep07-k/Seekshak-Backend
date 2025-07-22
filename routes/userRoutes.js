const express = require("express");
const router = express.Router();
const verifyFirebaseToken = require("../middleware/authMiddleware");
const User = require("../models/User");

router.get("/profile", verifyFirebaseToken, async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Only return necessary fields
        const { userId, name, phone, firebaseUid: uid } = user;
        res.json({ userId, name, phone, firebaseUid: uid });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
