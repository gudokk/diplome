import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";

// Установка дефолтной иконки
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl,
  shadowUrl: iconShadowUrl,
});

interface Resort {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

const ResortMap = () => {
  const [resorts, setResorts] = useState<Resort[]>([]);

  useEffect(() => {
    fetch("back/api/resorts")
      .then((res) => res.json())
      .then((data) => setResorts(data));
  }, []);

  return (
    <MapContainer
      center={[55, 37]}
      zoom={4}
      style={{ height: "40em", width: "80%", margin: "0 auto" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {resorts.map((resort) => (
        <Marker key={resort.id} position={[resort.latitude, resort.longitude]}>
          <Popup>{resort.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ResortMap;
