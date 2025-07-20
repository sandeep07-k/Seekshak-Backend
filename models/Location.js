const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  userId: { type: String, required: true },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true // [longitude, latitude]
    }
  },

  sublocality: { type: String },
  area: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String }
});

// ✅ Geo index
locationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);
