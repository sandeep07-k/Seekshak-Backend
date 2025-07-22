
const admin = require("firebase-admin");

const verifyFirebaseToken = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1] || req.body.firebaseToken;

    if (!token) {
        return res.status(401).json({ error: "Missing Firebase token" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        req.firebaseUid = decodedToken.uid;
        req.phone = decodedToken.phone_number;

        if (!req.phone) {
            return res.status(400).json({ error: "Phone number not found in Firebase token" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid Firebase token", details: error.message });
    }
};

module.exports = verifyFirebaseToken;

