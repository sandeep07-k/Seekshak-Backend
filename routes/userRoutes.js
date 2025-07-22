const express = require("express");
const router = express.Router();
const verifyFirebaseToken = require("../middleware/authMiddleware");
const User = require("../models/User");

router.get("/profile", verifyFirebaseToken, async (req, res) => {
    const firebaseUid = req.user?.uid;
    console.log("Finding user with UID:", firebaseUid);

    if (!firebaseUid) {
        return res.status(400).json({ error: "Invalid token payload: UID missing" });
    }

    try {
        const user = await User.findOne({ firebaseUid });
        console.log("Fetched user:", user);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { userId, name, phone } = user;
        res.json({ userId, name, phone, firebaseUid });
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Server error" });
    }
});



module.exports = router;
