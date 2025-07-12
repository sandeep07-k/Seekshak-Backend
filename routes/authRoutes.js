const express = require("express");
const router = express.Router();
const { signup, login,  checkUserExists } = require("../controllers/authcontroller");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

router.post("/signup", verifyFirebaseToken, signup);
router.post("/login", verifyFirebaseToken, login);
router.get('/check-user', checkUserExists);
router.get('/get-role', authcontroller.getRoleByPhone);



module.exports = router;

