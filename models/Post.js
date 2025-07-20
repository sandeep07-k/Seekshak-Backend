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
  // 🌍 Location Fields
  sublocality: String,
  area: String,
  city: String,
  state: String,
  country: String,

   // 📍 GeoJSON location for spatial queries
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere',
    }
  },

  postedDate: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['active', 'expired', 'paused', 'filled'],
    default: 'active',
  }
});

postSchema.plugin(AutoIncrement, { inc_field: 'tuitionCode', start_seq: 10001 });
module.exports = mongoose.model('Post', postSchema);
