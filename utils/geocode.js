const axios = require('axios');

async function getApproxArea(lat, lon) {
  const mapMyIndiaToken = process.env.MAPMYINDIA_TOKEN; 

  const url = `https://apis.mapmyindia.com/advancedmaps/v1/${mapMyIndiaToken}/rev_geocode?lat=${lat}&lng=${lon}`;

  try {
    const res = await axios.get(url);
    const data = res.data;

    if (data && data.results && data.results.length > 0) {
      const result = data.results[0];
      return result.formatted_address || 'Unknown Area';
    }

    return 'Unknown Area';
  } catch (error) {
    console.error('MapMyIndia Geocoding error:', error.message);
    return 'Unknown Area';
  }
}

module.exports = getApproxArea;

