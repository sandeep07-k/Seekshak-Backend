const Location = require('../models/Location');


// Define normally
const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, area, city, state, country, sublocality } = req.body;
    const userId = req.user.userId;

    let location = await Location.findOne({ userId });

    if (location) {
      location.location.coordinates = [longitude, latitude];
      location.sublocality = sublocality; // 🆕 Add this
      location.area = area;
      location.city = city;
      location.state = state;
      location.country = country;
      await location.save();
    } else {
      location = await Location.create({
        userId,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        sublocality, 
        area,
        city,
        state,
        country
      });
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

    // 1. Get user's current location
    const userLocation = await Location.findOne({ userId });
    if (!userLocation) {
      return res.status(400).json({ message: 'User location not found' });
    }

    const [lng, lat] = userLocation.location.coordinates;

    // 2. Find nearby locations using MongoDB $near
    const nearbyLocations = await Location.find({
      userId: { $ne: userId }, // Exclude self
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: 10000 // 10km in meters
        }
      }
    }).populate('userId'); // join user details

    // 3. Filter only educators and build response
    const educators = nearbyLocations
      .filter(loc => loc.userId && loc.userId.role === 'Educator')
      .map(loc => {
        return {
          id: loc.userId._id,
          name: loc.userId.name || 'Unnamed Educator',
          area: loc.area || '',
          city: loc.city || '',
          distanceInKm: calcHaversine(lat, lng, loc.location.coordinates[1], loc.location.coordinates[0]).toFixed(1)
        };
      });

    res.status(200).json({ educators });

  } catch (err) {
    console.error('Get Nearby Educators Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Optional: Use Haversine formula to calculate distance
function calcHaversine(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


// Export properly
module.exports = {
  updateLocation,
  getNearbyEducators
};
