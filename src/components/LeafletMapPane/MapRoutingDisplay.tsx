import { LatLng, LatLngTuple } from 'leaflet';
import { Polyline, Popup } from 'react-leaflet';
import { ICameraData, IMapSegmentData, IMapView, IRouteData } from './types';
import Marker from '../LeafletMarker';
import { Button } from 'antd';

export default function MapRoutingDisplay({
  camerasInRange,
  currentRoute,
  searchLatLng,
  searchDestinationLatLng,
  selectedCameraId,
  setSelectedCameraId,
}: {
  camerasInRange: ICameraData[];
  currentRoute: IRouteData | undefined;
  searchLatLng: LatLng | undefined;
  searchDestinationLatLng: LatLng | undefined;
  selectedCameraId: IMapView['selectedCameraId'];
  setSelectedCameraId: IMapView['setSelectedCameraId'];
}) {
  const renderCameras = () => {
    return (
      <>
        {camerasInRange.map((camera) => {
          const position = [camera.lat, camera.lng] as LatLngTuple;
          return (
            <Marker
              type={
                camera.cameraId === selectedCameraId
                  ? 'camera-selected'
                  : 'camera'
              }
              position={position}
              key={camera.cameraId}
            >
              <Popup>
                <div className="flex flex-col justify-center items-center gap-1">
                  <div>{camera.address}</div>
                  <Button
                    className="text-white"
                    onClick={() => {
                      console.log('camera #', camera.cameraId, 'clicked');
                      setSelectedCameraId(camera.cameraId);
                    }}
                  >
                    View
                  </Button>
                </div>
              </Popup>
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
