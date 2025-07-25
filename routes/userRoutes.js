const express = require("express");
const router = express.Router();
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const User = require("../models/User");

router.get("/profile", verifyFirebaseToken, async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.firebaseUid });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({
            userId: user._id,
            name: user.name,
            phone: user.phone,
            
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


// router.post("/setup", verifyFirebaseToken, async (req, res) => {
//     const { name, gender, qualification } = req.body;

//     try {
//         const user = await User.findOneAndUpdate(
//             { firebaseUid: req.firebaseUid },
//             { name, gender, qualification },
//             { new: true }
//         );

//         if (!user) return res.status(404).json({ error: "User not found" });

//         res.json({ success: true, user });
//     } catch (err) {
//         res.status(500).json({ error: "Server error", details: err.message });
//     }
// });
// router.get("/profile", verifyFirebaseToken, async (req, res) => {
//     try {
//         const user = await User.findOne({ firebaseUid: req.firebaseUid });
//         if (!user) return res.status(404).json({ error: "User not found" });

//         res.json({
//             success: true,
//             user: {
//                 name: user.name,
//                 phone: user.phone,
//                 role: user.role,
                
//             }
//         });
//     } catch (err) {
//         res.status(500).json({ error: "Server error", details: err.message });
//     }
// });

module.exports = router;
