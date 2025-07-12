const express = require("express");
const router = express.Router();
const { signup, login,  checkUserExists, getRoleByPhone } = require("../controllers/authcontroller");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

router.post("/signup", verifyFirebaseToken, signup);
router.post("/login", verifyFirebaseToken, login);
router.get('/check-user', checkUserExists);
router.get('/get-role', getRoleByPhone);



module.exports = router;

