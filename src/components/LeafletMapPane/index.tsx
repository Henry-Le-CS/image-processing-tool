import { LatLngTuple } from 'leaflet';
import dynamic from 'next/dynamic';
import { Popup } from 'react-leaflet';
import Marker from '@/components/LeafletMarker';
import { ICameraData, IRawCameraData } from '@/components/MapPane/type';
import axios from 'axios';
import {
  CAMERA_LIST_ENDPOINT,
  DEFAULT_CAMERA,
} from '@/components/MapPane/constants';
import { useEffect, useState } from 'react';
import { IMapPoint, IRouteData } from './types';

export default function LeafletMapPane() {
  const Map = dynamic(() => import('@/components/LeafletMap'), { ssr: false });

  const [cameras, setCameras] = useState<ICameraData[]>([DEFAULT_CAMERA]);
  const [currentRoute, setCurrentRoute] = useState<IRouteData>();
  // const [camerasOnRoute, setCamerasOnRoute] = useState<ICameraData[]>([]);

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

  const toRadian = (degree: number) => (degree * Math.PI) / 180;

  const calculateSegmentLength = (a: IMapPoint, b: IMapPoint) => {
    const EARTH_RADIUS = 6371;

    const lat1 = toRadian(a.lat);
    const lng1 = toRadian(a.lng);
    const lat2 = toRadian(b.lat);
    const lng2 = toRadian(b.lng);

    const dLat = lat1 - lat2;
    const dLng = lng1 - lng2;

    const x =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dLng / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(x));
    return c * EARTH_RADIUS * 1000;
  };
  const calculateDistanceToSegment = (
    point: IMapPoint,
    segment: { lat: number; lng: number; elat: number; elng: number }
  ) => {
    const a = calculateSegmentLength(
      { lat: segment.lat, lng: segment.lng },
      { lat: segment.elat, lng: segment.elng }
    );
    const b = calculateSegmentLength(point, {
      lat: segment.lat,
      lng: segment.lng,
    });
    const c = calculateSegmentLength(point, {
      lat: segment.elat,
      lng: segment.elng,
    });
    const p = 0.5 * (a + b + c);
    console.log('Triangle result: ', a, b, c, p);

    const distance = (2 * Math.sqrt(p * (p - a) * (p - b) * (p - c))) / a;
    console.log('Distance result:', distance);
  };

  useEffect(() => {
    if (currentRoute && currentRoute?.coords?.length != 0) {
      // List out cameras in range
      console.log('check route', currentRoute);
      const segments = currentRoute?.coords;
      if (segments && segments.length != 0) {
        calculateDistanceToSegment(cameras[0], segments[0]);

        // for (const segment of segments) {
        //   const
        // }
      } else {
        // alert('segment missing' + cameras.length + segments?.length);
      }
    } else {
      // alert('sth missing' + cameras.length);
    }
  }, [currentRoute]);

  const renderCameras = () => {
    return (
      <>
        {cameras.map((camera) => {
          const position = [camera.lat, camera.lng] as LatLngTuple;
          return (
            <Marker position={position} key={camera.cameraId}>
              <Popup>This is a camera</Popup>
            </Marker>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div>This is the new map pane.</div>
      {/* <LeafletMap /> */}
      <RountingSearchBar />
      <Map>
        <>{renderCameras()}</>
        {/* <>
          <ChildrenComponent />
          <ChildrenComponent />
          <ChildrenComponent />
        </> */}
      </Map>
    </>
  );
}

const RountingSearchBar = () => {
  return <div>hehe hoho</div>;
};

// const ChildrenComponent = () => {
//   // const position = [10.77231740416534, 106.65797689722078] as LatLngTuple;
//   const position = [Math.random() * 10, Math.random() * 120] as LatLngTuple;
//   return (
//     <>
//       <Marker position={position}>
//         <Popup>
//           You are here: {position[0]} {position[1]}
//         </Popup>
//       </Marker>
//     </>
//   );
// };
