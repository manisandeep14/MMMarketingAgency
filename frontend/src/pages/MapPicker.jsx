import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icon
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Shop emoji marker
const shopIcon = L.divIcon({
  className: "shop-marker",
  html: "🏢",
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

function LocationMarker({ setLocation }) {

  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {

      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);

      setLocation({ lat, lng });

    }
  });

  return position === null ? null : <Marker position={position} />;
}

export default function MapPicker({ setLocation }) {

  const shopLocation = [14.4426, 79.9865];

  // ✅ GPS auto detect
  useEffect(() => {

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setLocation({ lat, lng });

    });

  }, [setLocation]);

  return (

    <div style={{ height: "300px", width: "100%" }}>

      <MapContainer
        center={shopLocation}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Shop Marker */}
        <Marker position={shopLocation} icon={shopIcon}>
          <Popup>
            🏢 Our Store <br />
            Delivery starts here
          </Popup>
        </Marker>

        {/* User Marker */}
        <LocationMarker setLocation={setLocation} />

      </MapContainer>

    </div>
  );
}