import {
  CircleF,
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from '@react-google-maps/api';
import { AutoComplete, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import { ICameraData, IMapView, IRawCameraData } from './type';
import {
  CAMERA_LIST_ENDPOINT,
  DEFAULT_CAMERA,
  DEFAULT_LOCATION_LATLNG,
  DEFAULT_RADIUS,
  libraries,
} from './constants';
import axios from 'axios';
import { fetchLocationOptions } from '@/apis/map';
import { useDebounce } from '@/hooks/useDebounce';
import { IBKLocationOptions } from '@/apis/interfaces';

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
    googleMapsApiKey: 'AIzaSyB2ukoL3IFwRX2r7yUDZkp5VjH_H-f9B2A',
    libraries,
  });

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

  const [text, setText] = useState('');
  const [options, setOptions] = useState<string[]>([]); // Used for autocomplete component
  const [locationOptions, setLocationOptions] = useState<
    IBKLocationOptions | undefined
  >(undefined); // Used for retrieving lat lng

  const [hoveringCamId, setHoveringCamId] = useState<string>();

  const debouncedValue = useDebounce(text, 500);

  const generateAutocomplateOptions = (options?: IBKLocationOptions) => {
    if (!options) return [];

    const items = options?.items || [];
    const autocompleteOptions = items.map((item) => item.title);

    setOptions(autocompleteOptions);
  };

  const findLocationCoordinate = (location: string) => {
    const items = locationOptions?.items || [];
    const foundItem = items.find((item) => item.title === location);

    return foundItem?.position;
  };

  const onSelect = (value: string) => {
    const coordinate = findLocationCoordinate(value);

    if (coordinate) {
      const searchPlaceLatLng = {
        lat: Number(coordinate.lat),
        lng: Number(coordinate.lng),
      };

      setSearchLatLng(searchPlaceLatLng);

      setSelectedPlace(value);
      setText(value);

      const placesInRange = cameras.filter(
        ({ lat, lng }) =>
          google.maps.geometry.spherical.computeDistanceBetween(
            searchPlaceLatLng,
            {
              lat,
              lng,
            }
          ) <= DEFAULT_RADIUS
      );

      setCamerasInRange(placesInRange);
    }
  };

  useEffect(() => {
    if (!debouncedValue) return;

    const fetchLocation = async () => {
      const options = await fetchLocationOptions({
        location: debouncedValue,
      });

      setLocationOptions(options);
      generateAutocomplateOptions(options);
    };

    fetchLocation();
  }, [debouncedValue]);

  const handleMarkerClick = (camera: ICameraData) => {
    const { cameraId, lat, lng } = camera;

    setSelectedCameraId(cameraId);
    setZoom(16);

    setSelectedPlaceLatLng({ lat, lng });
  };

  const routeCoordinates = [
    { lat: 10.770023226733251, lng: 106.59139559067812 }, // 10.770023226733251, 106.59139559067812
    { lat: 10.770967187550223, lng: 106.5915891043086 }, // 10.770967187550223, 106.5915891043086
  ];



  const point = { lat: 10.770568017836563, lng: 106.59151137197117 }; // 10.770568017836563, 106.59151137197117

  const calculateAndDisplayRoute = () => {
    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer();

    directionsDisplay.setMap(map);

    directionsService.route(
      {
        origin: routeCoordinates[0],
        destination: routeCoordinates[routeCoordinates.length - 1],
        waypoints: routeCoordinates.slice(1, -1).map(coordinate => ({ location: coordinate })),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
          console.log(response);
          if (!response) return;
          const routes = response.routes;
          window.alert(pointBelongsToRoute(point, routes[0].legs));
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
  };

  function pointBelongsToRoute(point: any, routeCoordinates: any) {
    for (const leg of routeCoordinates) {
      for (const step of leg.steps) {
        const path = step.path;
        for (const routePoint of path) {
          // Calculate the distance between the point and the route point
          const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(point.lat, point.lng),
            new google.maps.LatLng(routePoint.lat(), routePoint.lng())
          );

          // If the distance is below a threshold (e.g., 10 meters), consider it part of the route
          if (distance < 10) {
            return true;
          }
        }
      }
    }
    return false;
  }




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
          <button onClick={calculateAndDisplayRoute}>hehe</button>
          <AutoComplete
            className="w-full"
            placeholder="Input a location name"
            value={text}
            options={options.map((value) => ({ value }))}
            onSelect={onSelect}
            onSearch={(value) => setText(value)}
          />
          <GoogleMap
            onLoad={(map) => {
              setMap(map)

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
                <Marker position={searchLatLng as google.maps.LatLngLiteral} />
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
                {camerasInRange.map((cam, id) => (
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
