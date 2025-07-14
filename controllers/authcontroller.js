
const mongoose = require("mongoose");
const admin = require("../config/firebase");
const User = require("../models/User");




// Helper to generate userId
const generateUserId = async (role) => {
  
  let prefix;
  switch (role.toLowerCase()) {
    case 'student':
      prefix = 'std_';
      break;
    case 'educator':
      prefix = 'edu_';
      break;
    case 'institute':
      prefix = 'ins_';
      break;
    default:
      throw new Error("Invalid role provided");
  }

  let userId, exists;
  do {
    // Generate a random number between 10000 and 99999
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    userId = `${prefix}${randomNum}`;

    // Check if the userId already exists in the database
    exists = await User.findOne({ userId });
  } while (exists); // Keep generating until a unique userId is found

  return userId;
};


exports.signup = async (req, res) => {
  try {
    const { role, name, phone } = req.body;
    const firebaseUid = req.firebaseUid;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Fix: remove email field if it's blank
    if (req.body.email && req.body.email.trim() !== "") {
      req.body.email = req.body.email.trim();
    } else {
      delete req.body.email;
    }

    const userId = await generateUserId(role);


    const newUser = new User({
      userId,
      name,
      role,
      phone,
      email: req.body.email, // ✅ safely use it now
      firebaseUid,
    });

    await newUser.save();

  
    res.status(201).json({ message: "User signup successfully", userId});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





// Actual login logic (no password)
exports.login = async (req, res) => {
  try {
    const { role } = req.body;
    const phone = req.phone; // ✅ Verified from Firebase token

    if (!role || !phone) {
      return res.status(400).json({ message: "Role and verified phone are required" });
    }

    const user = await User.findOne({ phone, role });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Login successful",
      userId: user.userId,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// get user role from backend
exports.getRoleByPhone = async (req, res) => {
  let { phone } = req.query;

  if (!phone) return res.status(400).json({ success: false, message: 'Phone number required' });

  if (!phone.startsWith('+91')) {
    phone = '+91' + phone.trim();
  }

  try {
    const user = await User.findOne({ phone });

    if (user) {
      return res.status(200).json({
        success: true,
        role: user.role,
        message: 'Role fetched successfully',
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Check if the user exists by phone number
exports.checkUserExists = async (req, res) => {
  let { phone } = req.query;

  if (!phone) {
    return res.status(400).json({ error: 'Mobile number is required' });
  }

  // Sanitize and normalize phone number
  phone = phone.replace(/\s+/g, '');
  if (!phone.startsWith('+91')) {
    phone = '+91' + phone;
  }

  try {
    const user = await User.findOne({ phone });
    if (user) {
      return res.status(200).json({
        exists: true,
        message: "Mobile number already exists. Please Login"
      });
    } else {
      return res.status(200).json({
        exists: false,
        message: "No user found with this mobile number"
      });
    }
  } catch (err) {
    console.error("Error checking user:", err);
    return res.status(500).json({ error: "Server error. Try again later." });
  }
};

