const express = require("express");
const router = express.Router();
const { signup, login, resetPassword } = require("../controllers/authcontroller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/reset-password", resetPassword);

module.exports = router;

