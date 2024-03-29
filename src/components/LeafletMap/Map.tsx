import { LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

const position = [10.77231740416534, 106.65797689722078] as LatLngExpression;

const Map = ({ children }: { children: React.ReactElement }) => {
  console.log('map rerendered');
  return (
    <div className="h-full">
      <MapContainer
        style={{ minHeight: '400px', height: '100%', width: '100%' }}
        center={position}
        zoom={14}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <>{children}</>
      </MapContainer>
    </div>
  );
};

export default Map;
