import { LatLng } from 'leaflet';
import { ICameraData, IRawCameraData } from '@/components/MapPane/type';
import axios from 'axios';
import {
  CAMERA_LIST_ENDPOINT,
  DEFAULT_CAMERA,
  TOLERANT_DISTANCE,
} from '@/components/MapPane/constants';
import { useEffect, useState } from 'react';
import { IMapPoint, IMapView, IRouteData } from './types';
import MapSearchBar from './MapSearchBar';
import MapRoutingDisplay from './MapRoutingDisplay';
import LeafletMap from '../LeafletMap';

export default function MapView({
  selectedCameraId,
  setSelectedCameraId,
  camerasInRange,
  setCamerasInRange,
}: IMapView) {
  // const MapComponent = dynamic(() => import('@/components/LeafletMap'), {
  //   ssr: false,
  //   loading: () => (
  //     <div className="h-[500px] w-full text-center">
  //       <Spin tip="Loading" size="large" />
  //     </div>
  //   ),
  // });

  console.log('rendering...');
  const [cameras, setCameras] = useState<ICameraData[]>([DEFAULT_CAMERA]);
  const [currentRoute, setCurrentRoute] = useState<IRouteData>();
  // const [camerasInRange, setCamerasInRange] = useState<ICameraData[]>([]);

  const [searchLatLng, setSearchLatLng] = useState<LatLng>();
  // useState<LatLng>(DEFAULT_START_LATLNG);
  const [searchDestinationLatLng, setSearchDestinationLatLng] =
    useState<LatLng>();
  // useState<LatLng>(DEFAULT_DESTINATION_LATLNG);

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
        `https://api.bktraffic.com/api/segment/dynamic-routing?slat=${searchLatLng?.lat}&slng=${searchLatLng?.lng}&elat=${searchDestinationLatLng?.lat}&elng=${searchDestinationLatLng?.lng}&type=distance&`
      );
      console.log(resp.data?.data);
      const routes = resp.data?.data;
      if (routes.length == 0) {
        alert('No route found for the specified locations. Please try again');
      }

      setCurrentRoute(routes[0]);
    };
    if (searchLatLng && searchDestinationLatLng) fetchRoutes();
  }, [searchLatLng, searchDestinationLatLng]);

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
        setCamerasInRange(validCameras);
        setSelectedCameraId('');
      }
    }
  }, [currentRoute, cameras]);

  return (
    <div className="flex flex-col gap-2">
      {/* <div>This is the new map pane.</div> */}
      <MapSearchBar
        setSearchLatLng={setSearchLatLng}
        setSearchDestinationLatLng={setSearchDestinationLatLng}
      />
      <LeafletMap>
        <>
          <MapRoutingDisplay
            camerasInRange={camerasInRange}
            currentRoute={currentRoute}
            searchLatLng={searchLatLng}
            searchDestinationLatLng={searchDestinationLatLng}
            selectedCameraId={selectedCameraId}
            setSelectedCameraId={setSelectedCameraId}
          />

          {/* <Marker position={DEFAULT_LOCATION_LATLNG}>
            <Popup>This is HCMUT</Popup>
          </Marker> */}
        </>
      </LeafletMap>
    </div>
  );
}
