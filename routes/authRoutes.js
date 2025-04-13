const express = require("express");
const router = express.Router();
const { signup, login, resetPassword, checkUserExists } = require("../controllers/authcontroller");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

router.post("/signup", verifyFirebaseToken, signup);
// router.post("/signup", signup);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get('/check-user', checkUserExists);

module.exports = router;

