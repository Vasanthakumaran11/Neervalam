/**
 * Open-Source Geocoding & Location Search Service for Tamil Nadu
 * Leverages OpenStreetMap Nominatim API (Open-Source / ODbL) with Tamil Nadu bounding constraints,
 * combined with local indexing of CGWB monitoring stations and district centroids.
 */

// Bounding box for Tamil Nadu & Puducherry: [minLon, maxLat, maxLon, minLat]
// Roughly: Longitude 76.15°E to 80.35°E, Latitude 8.08°N to 13.55°N
const TN_VIEWBOX = '76.15,13.55,80.35,8.08';

/**
 * Searches for places within Tamil Nadu using the open-source Nominatim API
 * @param {string} query - Location or place name entered by user
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of normalized location objects
 */
export async function searchTamilNaduPlaces(query, limit = 5) {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim();
  
  try {
    // Append Tamil Nadu, India to ensure results prioritize Tamil Nadu geography
    const searchQuery = cleanQuery.toLowerCase().includes('tamil nadu') 
      ? cleanQuery 
      : `${cleanQuery}, Tamil Nadu, India`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      searchQuery
    )}&countrycodes=in&viewbox=${TN_VIEWBOX}&bounded=0&limit=${limit}&addressdetails=1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return (data || []).map((item, idx) => {
      const address = item.address || {};
      const cityOrDistrict = 
        address.city || 
        address.town || 
        address.village || 
        address.county || 
        address.state_district || 
        address.state || 
        'Tamil Nadu';

      return {
        id: `osm-${item.place_id || idx}`,
        title: item.name || cleanQuery,
        subtitle: `${cityOrDistrict}, Tamil Nadu`,
        fullAddress: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        type: 'place',
        category: item.type || item.class || 'location'
      };
    });
  } catch (err) {
    // Graceful fallback on network error or offline
    console.debug('Open-source geocoding notice:', err.message);
    return [];
  }
}

/**
 * Calculates Great-Circle distance in kilometers between two coordinates
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Finds the nearest monitoring station from the 818 CGWB dataset to a given coordinate
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Array} wells - CGWB well array
 * @returns {object|null} Nearest well station with distance in km
 */
export function findNearestWellStation(lat, lon, wells = []) {
  if (!wells || wells.length === 0 || isNaN(lat) || isNaN(lon)) return null;

  let nearest = null;
  let minDistance = Infinity;

  for (const well of wells) {
    if (well.latitude && well.longitude) {
      const dist = calculateDistanceKm(lat, lon, well.latitude, well.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = { ...well, distanceKm: dist };
      }
    }
  }

  return nearest;
}
