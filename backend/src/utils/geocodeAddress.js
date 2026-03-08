import axios from "axios";

export const geocodeAddress = async (address) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_KEY}`;

  const res = await axios.get(url);

  // Safety check
  if (!res.data.results || res.data.results.length === 0) {
    throw new Error("Unable to find location for the given address");
  }

  const location = res.data.results[0].geometry.location;

  return {
    lat: location.lat,
    lng: location.lng
  };
};