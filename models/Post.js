const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  tuitionCode: { type: Number, unique: true },
  className: String,
  subject: String,
  educationBoard: String,
  fee: String,
  duration: String,
  classSchedule: String,
  classTiming: String,
  gender: String,
  demoClassDate: String,
  modeOfClass: String,
  qualification: String,
  specialReq: String,
  createdAt: { type: Date, default: Date.now },
});

postSchema.plugin(AutoIncrement, { inc_field: 'tuitionCode', start_seq: 10001 });
module.exports = mongoose.model('Post', postSchema);

