const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  role: { type: String, enum: ["student", "teacher", "institute"], required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
