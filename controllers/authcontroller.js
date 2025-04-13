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
    const { role,name, email , phone, password} = req.body;
    const firebaseUid = req.firebaseUid;

    const existingUser = await User.findOne({ email, phone });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const userId = await generateUserId(role);
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({ userId, name, role, gender, phone, email, password: hashedPassword, firebaseUid });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { role, userId, email, phone, password } = req.body;

    // Build the query based on which identifier is provided
    let query = {};

    if (email) {
      query.email = email;
    } else if (phone) {
      query.phone = phone;
    } else if (userId) {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        query._id = userId;
      } else {
        query.userId = userId;
      }
    } else {
      return res.status(400).json({ message: "Please provide email, phone, or userId" });
    }

    // Find the user
    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Check role
    if (user.role !== role) {
      return res.status(403).json({ message: "Role mismatch. Access denied." });
    }

    // Check password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });

    // Success response
    res.status(200).json({
      message: "Login successful",
      UserId: user.userId,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, firebaseToken } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const firebaseUid = decodedToken.uid;

    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Check if the user exists by phone number
exports.checkUserExists = async (req, res) => {
  const { phone, email } = req.query;

  if (!phone && !email) {
      return res.status(400).json({ error: 'Phone number or email is required' });
  }

  try {
      let formattedPhone = phone ? phone.replace(/\s+/g, '') : null;

      if (formattedPhone && !formattedPhone.startsWith('+91')) {
          formattedPhone = '+91' + formattedPhone;
      }

      console.log("Checking user with phone:", formattedPhone, "and email:", email);

      const user = await User.findOne({
          $or: [
              { phone: formattedPhone },
              { email: email }
          ]
      });

      if (user) {
          return res.status(200).json({
              exists: true,
              message: 'User already exists. Please login.'
          });
      } else {
          return res.status(200).json({
              exists: false,
              message: 'No user found with this phone or email'
          });
      }

  } catch (err) {
      console.error("Error checking user:", err);
      return res.status(500).json({ error: "Server error. Try again later." });
  }
};
