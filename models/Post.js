const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Firebase UID
  className: String,
  subject: String,
  educationBoard: String,
  fee: String,
  duration: String,
  noOfClasses: String,
  classTiming: String,
  gender: String,
  demoClassDate: String,
  modeOfClass: String,
  qualification: String,
  specialReq: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);

