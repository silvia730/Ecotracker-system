import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../api';

function getColor(risk) {
  if (risk < 40) return 'green';
  if (risk <= 70) return 'yellow';
  return 'red';
}

const NairobiMap = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/api/locations-data')
      .then(res => {
        setLocations(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading map data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <MapContainer center={[-1.286389, 36.817223]} zoom={12} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc, idx) => (
        <CircleMarker
          key={idx}
          center={[loc.coords.lat, loc.coords.lng]}
          radius={20}
          pathOptions={{ color: getColor(loc.cancerRisk), fillColor: getColor(loc.cancerRisk), fillOpacity: 0.5 }}
        >
          <Popup>
            <strong>{loc.name}</strong><br />
            CO₂ Level: {loc.co2Level !== null ? loc.co2Level + ' ppm' : 'N/A'}<br />
            Cancer Risk: {loc.cancerRisk !== null ? loc.cancerRisk + '%' : 'N/A'}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default NairobiMap; 