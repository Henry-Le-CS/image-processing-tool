import { LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

const position = [10.77231740416534, 106.65797689722078] as LatLngExpression;

const Map = ({ children }: { children: React.ReactElement }) => {
  return (
    <div>
      <MapContainer
        style={{ height: '600px', width: '800px' }}
        center={position}
        zoom={15}
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
