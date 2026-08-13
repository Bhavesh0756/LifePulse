/**
 * LifePulse Distance Calculator Utility
 * Uses Haversine Formula for real-world Geographic Distance (in km)
 */

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculate Haversine distance between two sets of lat/lng coordinates.
 * Returns distance in kilometers rounded to 1 decimal place, or null if coordinates missing/invalid.
 * 
 * @param {Object} coordsA - { latitude, longitude }
 * @param {Object} coordsB - { latitude, longitude }
 * @returns {number|null} Distance in km or null if unavailable
 */
function calculateDistanceKm(coordsA, coordsB) {
  if (
    !coordsA ||
    !coordsB ||
    typeof coordsA.latitude !== 'number' ||
    typeof coordsA.longitude !== 'number' ||
    typeof coordsB.latitude !== 'number' ||
    typeof coordsB.longitude !== 'number'
  ) {
    return null; // NEVER invent fake distances
  }

  const lat1 = coordsA.latitude;
  const lon1 = coordsA.longitude;
  const lat2 = coordsB.latitude;
  const lon2 = coordsB.longitude;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place (e.g. 6.2 km)
}

module.exports = {
  calculateDistanceKm,
};
