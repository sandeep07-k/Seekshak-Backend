const admin = require("firebase-admin");


const verifyFirebaseToken = async (req, res, next) => {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
        return res.status(401).json({ error: "Missing Firebase token" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        req.firebaseUid = decodedToken.uid; // Set UID in request
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid Firebase token", details: error.message });
    }
};

module.exports = verifyFirebaseToken;
