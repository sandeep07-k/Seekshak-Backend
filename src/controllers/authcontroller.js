const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const admin = require("../config/firebase");
const User = require("../models/User");

// Helper to generate userId
const generateUserId = async (role) => {
  const prefix = role.charAt(0).toUpperCase();
  let userId, exists;
  do {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    userId = `${prefix}-${randomNum}`;
    exists = await User.findOne({ userId });
  } while (exists);
  return userId;
};

exports.signup = async (req, res) => {
  try {
    const { role, phone, password, email } = req.body;

    const existingUser = await User.findOne({ email, phone });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const userId = await generateUserId(role);
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({ userId, role, phone, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { userId, email, password } = req.body;

    let query = email ? { email } : mongoose.Types.ObjectId.isValid(userId)
      ? { _id: userId } : { userId };

    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });

    res.status(200).json({
      message: "Login successful",
      Id: user._id,
      UserId: user.userId,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { phone, newPassword, firebaseToken } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    if (decodedToken.phone_number !== phone)
      return res.status(400).json({ message: "Phone number mismatch" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
