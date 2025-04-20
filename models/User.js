const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  name: {type:String , sparse: true},
  role: { type: String, enum: ["Student", "Educator", "Institute"], required: true },
  email: {
    type: String,
    unique: true,
    sparse: true,
    
  },
  
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firebaseUid: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("User", userSchema);
