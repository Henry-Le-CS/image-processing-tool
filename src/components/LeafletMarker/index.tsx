import { LatLngExpression, icon } from 'leaflet';
import { ReactNode } from 'react';
import { Marker as LeafletMarker } from 'react-leaflet';

const MARKER_ICON = icon({
  iconUrl: '/marker-icon.png',
  iconSize: [32, 48],
});

export default function Marker({
  position,
  children,
}: {
  position: LatLngExpression;
  children: ReactNode;
}) {
  return (
    <LeafletMarker icon={MARKER_ICON} position={position}>
      {children}
    </LeafletMarker>
  );
}
