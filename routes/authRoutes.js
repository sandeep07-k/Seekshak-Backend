const express = require("express");
const router = express.Router();
const { signup, login, resetPassword, checkUserExists } = require("../controllers/authcontroller");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

router.post("/signup", verifyFirebaseToken, signup);
// router.post("/login", login);
router.post("/login", verifyFirebaseToken, login);
router.get('/check-user', checkUserExists);



module.exports = router;

