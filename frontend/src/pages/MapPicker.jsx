import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

function LocationMarker({ setLocation }) {

  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {

      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);

      setLocation({
        lat,
        lng
      });

    }
  });

  return position === null ? null : <Marker position={position} />;
}

export default function MapPicker({ setLocation }) {

  return (

    <div style={{ height: "300px", width: "100%" }}>

      <MapContainer
        center={[14.4426, 79.9865]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker setLocation={setLocation} />

      </MapContainer>

    </div>

  );
}