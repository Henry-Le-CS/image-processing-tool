import {
  CircleF,
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from '@react-google-maps/api';
import { Typography } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { ICameraData, IMapView, IRawCameraData } from './type';
import {
  CAMERA_LIST_ENDPOINT,
  DEFAULT_CAMERA,
  DEFAULT_LOCATION_LATLNG,
  DEFAULT_RADIUS,
  TOLERANT_DISTANCE,
  libraries,
} from './constants';
import axios from 'axios';
import { MapSearchBar } from './MapSearchBar';

const containerStyle = {
  width: '100%',
  minWidth: '100%',
  aspectRatio: '4/3',
};

const MapView: FC<IMapView> = ({
  camerasInRange,
  setCamerasInRange,
  selectedCameraId,
  setSelectedCameraId,
}) => {
  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY ?? 'AIzaSyB2ukoL3IFwRX2r7yUDZkp5VjH_H-f9B2A',
    libraries,
  });

  const [currentView, setCurrentView] = useState<'circle' | 'route'>('circle')
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState<number>(14);

  const [cameras, setCameras] = useState<ICameraData[]>([DEFAULT_CAMERA]);

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

      setCameras(mappedList);
    };
    fetchData();
  }, []);

  const [selectedPlace, setSelectedPlace] = useState('');
  const [searchLatLng, setSearchLatLng] = useState<google.maps.LatLngLiteral>();
  const [selectedPlaceLatLng, setSelectedPlaceLatLng] =
    useState<google.maps.LatLngLiteral>();

  const [searchDestinationLatLng, setSearchDestinationLatLng] = useState<google.maps.LatLngLiteral>();

  const googleMapDirectionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);

  const [hoveringCamId, setHoveringCamId] = useState<string>();

  const handleMarkerClick = (camera: ICameraData) => {
    const { cameraId, lat, lng } = camera;

    setSelectedCameraId(cameraId);
    setZoom(16);

    setSelectedPlaceLatLng({ lat, lng });
  };

  const camerasBelongToRoute = (cameras: ICameraData[], routes: google.maps.DirectionsRoute[]) => {
    const legs = routes[0].legs; // We take the first leg because we only have 2 endpoint

    const routePoinsLatLng = [];

    for (const leg of legs) {
      const steps = leg.steps

      for (const step of steps) {
        const path = step.path;

        for (const routePoint of path) {
          routePoinsLatLng.push({ lat: routePoint.lat(), lng: routePoint.lng() })
        }
      }
    }

    const camerasInRange = []

    for (const camera of cameras) {
      for (const routePoint of routePoinsLatLng) {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(camera.lat, camera.lng),
          new google.maps.LatLng(routePoint.lat, routePoint.lng)
        );

        if (distance < TOLERANT_DISTANCE) {
          camerasInRange.push(camera);
          break;
        }
      }
    }

    return camerasInRange;
  }

  const calculateAndDisplayRoute = () => {
    const directionsService = new google.maps.DirectionsService();

    const originLat = searchLatLng?.lat, originLng = searchLatLng?.lng;
    const destinationLat = searchDestinationLatLng?.lat, destinationLng = searchDestinationLatLng?.lng;

    if (!originLat || !originLng || !destinationLat || !destinationLng) return;

    directionsService.route(
      {
        origin: searchLatLng,
        destination: searchDestinationLatLng,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === 'OK') {

          if (!googleMapDirectionsRenderer.current) return;

          googleMapDirectionsRenderer.current.setMap(map);
          googleMapDirectionsRenderer.current.setDirections(response);
          if (!response) return;

          const routes = response.routes;
          const camerasInRange = camerasBelongToRoute(cameras, routes);
          setCamerasInRange(camerasInRange);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
  };

  useEffect(() => {
    const originLat = searchLatLng?.lat, originLng = searchLatLng?.lng;
    const destinationLat = searchDestinationLatLng?.lat, destinationLng = searchDestinationLatLng?.lng;

    if (!originLat || !originLng || !destinationLat || !destinationLng) return;

    calculateAndDisplayRoute();
  }, [searchLatLng, searchDestinationLatLng])

  useEffect(() => {
    if (currentView == "circle") {
      googleMapDirectionsRenderer.current?.setMap(null);
    }
  }, [currentView])

  const showInfo = (id: string) =>
    hoveringCamId == id || selectedCameraId == id;

  return (
    <>
      {!isLoaded && <div>Loading...</div>}
      {isLoaded && (
        <div className="w-full h-max flex flex-col gap-2 justify-center items-center">
          <Typography.Title level={5} className="m-0">
            Map View
          </Typography.Title>
          <MapSearchBar
            cameras={cameras}
            currentView={currentView}
            setCurrentView={setCurrentView}
            setSearchLatLng={setSearchLatLng}
            setSelectedPlace={setSelectedPlace}
            setCamerasInRange={setCamerasInRange}
            setSelectedPlaceLatLng={setSelectedPlaceLatLng}
            setSearchDestinationLatLng={setSearchDestinationLatLng}
          />
          <GoogleMap
            onLoad={(map) => {
              setMap(map)
              googleMapDirectionsRenderer.current = new google.maps.DirectionsRenderer();
            }}
            mapContainerStyle={containerStyle}
            center={
              selectedPlaceLatLng || searchLatLng || DEFAULT_LOCATION_LATLNG
            }
            zoom={zoom}
            onZoomChanged={() => setZoom(map?.getZoom() || 14)}
          >
            {selectedPlace && (
              <>
                {currentView == 'circle' &&
                  <>
                    <CircleF
                      center={searchLatLng as google.maps.LatLngLiteral}
                      radius={DEFAULT_RADIUS}
                      options={{
                        fillColor: 'turquoise',
                        strokeColor: 'turquoise',
                        strokeOpacity: 0.8,
                        fillOpacity: 0.1,
                      }}
                    />
                    <Marker position={searchLatLng as google.maps.LatLngLiteral} />
                  </>
                }
                {camerasInRange.map((cam, id) => cam && (
                  <Marker
                    key={cam.cameraId}
                    label={{ color: 'white', text: `${id + 1}` }}
                    position={
                      {
                        lat: cam.lat,
                        lng: cam.lng,
                      } as google.maps.LatLngLiteral
                    }
                    onClick={() => handleMarkerClick(cam)}
                    onMouseOver={() => setHoveringCamId(cam.cameraId)}
                    onMouseOut={() => setHoveringCamId('')}
                  >
                    {showInfo(cam.cameraId) && (
                      <InfoWindow>
                        <Typography.Text strong>{cam.address}</Typography.Text>
                      </InfoWindow>
                    )}
                  </Marker>
                ))}
              </>
            )}
          </GoogleMap>
        </div>
      )}
    </>
  );
};

export default MapView;
