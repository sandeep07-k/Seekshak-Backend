const Location = require('../models/Location');
const geolib = require('geolib');
const User = require('../models/User');

// Define normally
const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, area, city, state, country } = req.body;
    const userId = req.user.userId;

    let location = await Location.findOne({ userId });

    if (location) {
      location.latitude = latitude;
      location.longitude = longitude;
      location.area = area;
      location.city = city;
      location.state = state;
      location.country = country;
      await location.save();
    } else {
      location = await Location.create({ userId, latitude, longitude, area, city, state, country });
    }

    res.status(200).json({ message: 'Location updated successfully' });
  } catch (err) {
    console.error('Update Location Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getNearbyEducators = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userLocation = await Location.findOne({ userId });

    if (!userLocation) {
      return res.status(400).json({ message: 'User location not found' });
    }

    const locations = await Location.find({ userId: { $ne: userId } }).populate('userId');

    const nearbyEducators = [];

    locations.forEach(loc => {
      if (!loc.userId) return;

      const distance = geolib.getDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: loc.latitude, longitude: loc.longitude }
      );

      const distanceInKm = distance / 1000;

      if (loc.userId.role === 'Educator' && distanceInKm <= 10) {
        nearbyEducators.push({
          id: loc.userId._id,
          name: loc.userId.name || 'Unnamed Educator',
          distanceInKm: distanceInKm.toFixed(1),
          area: loc.area,
          city: loc.city
        });
      }
    });

    res.status(200).json({ educators: nearbyEducators });
  } catch (err) {
    console.error('Get Nearby Educators Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export properly
module.exports = {
  updateLocation,
  getNearbyEducators
};
