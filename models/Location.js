const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  area: String,
  city: String,
  state: String,
  country: String
});

locationSchema.index({ location: '2dsphere' }); // <-- important index

module.exports = mongoose.model('Location', locationSchema);
