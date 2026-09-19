import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import StatusBadge from './StatusBadge';

// Custom Marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const greenIcon = createCustomIcon('#10B981');
const redIcon = createCustomIcon('#EF4444');
const yellowIcon = createCustomIcon('#F59E0B');
const blueIcon = createCustomIcon('#2C7BE5');

export default function MapWrapper({ shipments = [], height = "360px", routePoints = null }) {
  const centerCoimbatore = [11.0168, 76.9558];

  const getMarkerIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'safe': return greenIcon;
      case 'alert': return redIcon;
      case 'offline': return yellowIcon;
      default: return blueIcon;
    }
  };

  return (
    <div style={{ height }} className="relative rounded-xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer
        center={centerCoimbatore}
        zoom={7}
        scrollWheelZoom={false}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {shipments.map((s) => (
          <Marker
            key={s.shipment_id || s.id}
            position={[s.lat || 11.0168, s.lng || 76.9558]}
            icon={getMarkerIcon(s.status)}
          >
            <Popup>
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-extrabold text-sm text-slate-900">{s.shipment_id}</span>
                  <StatusBadge status={s.status} />
                </div>
                <p className="text-xs font-bold text-[#0A2647] mb-1">{s.product_name}</p>
                <div className="text-[11px] text-slate-500 space-y-0.5 border-t pt-1.5 mt-1">
                  <div><strong>Route:</strong> {s.origin} ➔ {s.destination}</div>
                  <div><strong>Temp:</strong> {s.current_temp}°C</div>
                  <div><strong>Humidity:</strong> {s.current_humidity}%</div>
                  <div><strong>Shock:</strong> {s.current_shock}g</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {routePoints && routePoints.length > 0 && (
          <Polyline
            positions={routePoints}
            color="#2C7BE5"
            weight={4}
            dashArray="8, 8"
          />
        )}
      </MapContainer>
    </div>
  );
}
