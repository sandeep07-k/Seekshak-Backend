const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  name: {type:String , sparse: true},
  role: { type: String, enum: ["student", "educator", "institute"], required: true },
  email: { type: String, unique: true, sparse: true, },
  phone: { type: String, unique: true, required: true },
  firebaseUid: { type: String, unique: true,},
  location: {
    type: { type: String, enum: ['Point'], default: 'Point'},
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  approxArea: {
    type: String,
    default: ''
  },
  
  profileImage: { type: String, default: "" }


});
userSchema.index({ location: '2dsphere' });
module.exports = mongoose.model("User", userSchema);
