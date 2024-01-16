import { LatLngExpression, icon } from 'leaflet';
import { ReactNode } from 'react';
import { Marker as LeafletMarker } from 'react-leaflet';

const MARKER_ICON = icon({
  iconUrl: '/marker-icon.png',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
});

const CAMERA_ICON = icon({
  iconUrl: '/camera-marker-icon.png',
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

export default function Marker({
  type = 'default',
  position,
  children,
}: {
  type?: string;
  position: LatLngExpression;
  children: ReactNode;
}) {
  let icon;
  switch (type) {
    case 'camera':
      icon = CAMERA_ICON;
      break;
    default:
      icon = MARKER_ICON;
      break;
  }
  return (
    <LeafletMarker icon={icon} position={position}>
      {children}
    </LeafletMarker>
  );
}
