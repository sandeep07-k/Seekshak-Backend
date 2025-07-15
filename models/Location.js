const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true  // [longitude, latitude]
    }
  },

  area: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String }
});

// ✅ Geo index
locationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);
