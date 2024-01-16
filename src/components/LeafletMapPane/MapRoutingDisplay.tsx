import { LatLng, LatLngBounds, LatLngTuple } from 'leaflet';
import { Polyline, Popup, useMap } from 'react-leaflet';
import { ICameraData, IMapSegmentData, IMapView, IRouteData } from './types';
import Marker from '../LeafletMarker';
import { Button } from 'antd';
import { useEffect } from 'react';

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
  const map = useMap();

  useEffect(() => {
    if (selectedCameraId && selectedCameraId !== '') {
      const camera = camerasInRange.find(
        (c) => c.cameraId === selectedCameraId
      );
      if (camera) {
        const newPosition = new LatLng(camera.lat, camera.lng);
        map.setView(newPosition);
        console.log('Map re-centered');
      }
    }
  }, [selectedCameraId]);

  useEffect(() => {
    if (searchLatLng && searchDestinationLatLng) {
      const center = new LatLng(
        (searchLatLng.lat + searchDestinationLatLng.lat) / 2,
        (searchLatLng.lng + searchDestinationLatLng.lng) / 2
      );
      map.setView(center);
      const bounds = new LatLngBounds(searchLatLng, searchDestinationLatLng);
      map.fitBounds(bounds);
    }
  }, [currentRoute]);

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
