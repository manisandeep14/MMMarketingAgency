import axios from "axios";

export const geocodeAddress = async (address) => {

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_KEY}`;

  const res = await axios.get(url);

  if (!res.data.results || res.data.results.length === 0) {
    throw new Error("Address not found by Google Maps");
  }

  const location = res.data.results[0].geometry.location;

  return {
    lat: location.lat,
    lng: location.lng
  };

};