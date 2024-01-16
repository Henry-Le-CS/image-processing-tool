import { LatLng, LatLngTuple } from 'leaflet';
import dynamic from 'next/dynamic';
import { Polyline, Popup } from 'react-leaflet';
import Marker from '@/components/LeafletMarker';
import { ICameraData, IRawCameraData } from '@/components/MapPane/type';
import axios from 'axios';
import {
  CAMERA_LIST_ENDPOINT,
  DEFAULT_CAMERA,
  DEFAULT_LOCATION_LATLNG,
  TOLERANT_DISTANCE,
} from '@/components/MapPane/constants';
import { useEffect, useState } from 'react';
import { IMapPoint, IMapSegmentData, IRouteData } from './types';

export default function LeafletMapPane() {
  const MapComponent = dynamic(() => import('@/components/LeafletMap'), {
    ssr: false,
  });

  const [cameras, setCameras] = useState<ICameraData[]>([DEFAULT_CAMERA]);
  const [currentRoute, setCurrentRoute] = useState<IRouteData>();
  const [camerasOnRoute, setCamerasOnRoute] = useState<ICameraData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await axios.get(CAMERA_LIST_ENDPOINT);
      if (!resp.data)
        throw new Error('[error]: Error fetching list of cameras');

      const mappedList = resp.data.cameraList.map(
        ({ address, latitude, longitude, camera_id }: IRawCameraData) => {
          return {
            address,
            lat: Number(latitude),
            lng: Number(longitude),
            cameraId: camera_id,
          } as ICameraData;
        }
      );

      console.log('list of cams:', mappedList);
      setCameras(mappedList);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      const resp = await axios.get(
        'https://api.bktraffic.com/api/segment/dynamic-routing?slat=10.79376&slng=106.63754&elat=10.77853&elng=106.69594&type=distance&'
      );
      console.log(resp.data?.data);
      const routes = resp.data?.data;
      if (routes.length == 0) {
        alert('No route found for the specified locations. Please try again');
      }

      setCurrentRoute(routes[0]);
    };
    fetchRoutes();
  }, []);

  const calculateDistanceToSegment = (
    point: IMapPoint,
    segment: { lat: number; lng: number; elat: number; elng: number }
  ) => {
    const point1 = new LatLng(point.lat, point.lng);
    const point2 = new LatLng(
      (segment.lat + segment.elat) / 2,
      (segment.lng + segment.elng) / 2
    );
    return point1.distanceTo(point2);
  };

  useEffect(() => {
    if (currentRoute && currentRoute?.coords?.length != 0) {
      const segments = currentRoute?.coords;
      if (segments && segments.length != 0) {
        const validCameras = [];
        for (const cam of cameras) {
          let minDist = 9999999;
          for (const segment of segments) {
            const dist = calculateDistanceToSegment(
              { lat: cam.lat, lng: cam.lng },
              segment
            );
            if (dist <= TOLERANT_DISTANCE) {
              validCameras.push({ ...cam });
              break;
            }
            minDist = Math.min(minDist, dist);
          }
        }
        console.log('cameras in range: ', validCameras);
        setCamerasOnRoute(validCameras);
      }
    }
  }, [currentRoute, cameras]);

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

  const renderRoute = () => {
    if (currentRoute != null) {
      return <Polyline positions={extractWaypoints(currentRoute?.coords)} />;
    }
  };

  const extractWaypoints = (segments: IMapSegmentData[]) =>
    segments.flatMap(({ lat, lng, elat, elng }) => [
      [lat, lng] as LatLngTuple,
      [elat, elng] as LatLngTuple,
    ]);

  return (
    <>
      <div>This is the new map pane.</div>
      <RountingSearchBar />
      <MapComponent>
        <>
          {renderCameras()}
          {renderRoute()}
          <Marker position={DEFAULT_LOCATION_LATLNG}>
            <Popup>This is HCMUT</Popup>
          </Marker>
        </>
      </MapComponent>
    </>
  );
}

const RountingSearchBar = () => {
  return <div>This is Routing search bar</div>;
};
