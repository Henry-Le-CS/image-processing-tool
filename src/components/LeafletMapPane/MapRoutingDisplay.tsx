import { LatLng, LatLngTuple } from 'leaflet';
import { Polyline, Popup } from 'react-leaflet';
import { ICameraData, IMapSegmentData, IRouteData } from './types';
import Marker from '../LeafletMarker';

export default function MapRoutingDisplay({
  camerasOnRoute,
  currentRoute,
  searchLatLng,
  searchDestinationLatLng,
}: {
  camerasOnRoute: ICameraData[];
  currentRoute: IRouteData | undefined;
  searchLatLng: LatLng;
  searchDestinationLatLng: LatLng;
}) {
  const renderCameras = () => {
    return (
      <>
        {camerasOnRoute.map((camera) => {
          const position = [camera.lat, camera.lng] as LatLngTuple;
          return (
            <Marker type="camera" position={position} key={camera.cameraId}>
              <Popup>This is a camera</Popup>
            </Marker>
          );
        })}
      </>
    );
  };

  const extractWaypoints = (segments: IMapSegmentData[]) =>
    segments.flatMap(({ lat, lng, elat, elng }) => [
      [lat, lng] as LatLngTuple,
      [elat, elng] as LatLngTuple,
    ]);

  const renderRoute = () => {
    if (currentRoute != null) {
      return <Polyline positions={extractWaypoints(currentRoute?.coords)} />;
    }
  };

  const renderRouteEndpoints = () => {
    return (
      <>
        {searchLatLng && (
          <Marker type="start" position={searchLatLng}>
            <Popup>This is start location</Popup>
          </Marker>
        )}
        {searchDestinationLatLng && (
          <Marker type="destination" position={searchDestinationLatLng}>
            <Popup>This is destination location</Popup>
          </Marker>
        )}
      </>
    );
  };
  return (
    <>
      {renderCameras()}
      {renderRoute()}
      {renderRouteEndpoints()}
    </>
  );
}
