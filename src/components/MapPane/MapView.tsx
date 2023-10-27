import {
  Autocomplete,
  CircleF,
  GoogleMap,
  Marker,
  useLoadScript,
} from '@react-google-maps/api';
import { Typography } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { ICameraData, IMapView, IRawCameraData } from './type';
import {
  CAMERA_LIST_ENDPOINT,
  DEFAULT_LOCATION_LATLNG,
  DEFAULT_RADIUS,
} from './constants';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  minWidth: '100%',
  aspectRatio: '4/3',
};

const MapView: FC<IMapView> = ({ camerasInRange, setCamerasInRange }) => {
  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyB2ukoL3IFwRX2r7yUDZkp5VjH_H-f9B2A',
    libraries: ['places', 'geometry'],
  });

  const [cameras, setCameras] = useState<ICameraData[]>([
    {
      address: 'Hai Bà Trưng - Lý Chính Thắng',
      lat: 10.791464,
      cameraId: '5deb576d1dc17d7c5515acff',
      lng: 106.687554,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await axios.get(CAMERA_LIST_ENDPOINT);
      if (!resp.data)
        throw new Error('[error]: Error fetching list of cameras');
      console.log('gotten resp:', resp);

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
      console.log('updated list', cameras);
    };
    fetchData();
  }, []);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<
    google.maps.places.PlaceResult | undefined
  >();
  const [searchLatLng, setSearchLatLng] = useState<google.maps.LatLngLiteral>();

  const handlePlaceChange = () => {
    const place = autocompleteRef.current?.getPlace();
    console.log('place changed', place);
    const placeLatLng: google.maps.LatLngLiteral = {
      lat: place?.geometry?.location?.lat(),
      lng: place?.geometry?.location?.lng(),
    } as google.maps.LatLngLiteral;
    setSelectedPlace(place);
    setSearchLatLng(placeLatLng);

    const placesInRange = cameras.filter(
      ({ lat, lng }) =>
        google.maps.geometry.spherical.computeDistanceBetween(placeLatLng, {
          lat,
          lng,
        }) <= DEFAULT_RADIUS
    );
    setCamerasInRange(placesInRange);
  };

  return (
    <>
      {!isLoaded && <div>Loading...</div>}
      {isLoaded && (
        <div className="w-full flex flex-col gap-2 justify-center items-center">
          <Typography.Title level={5} className="m-0">
            Map View
          </Typography.Title>
          <Autocomplete
            onLoad={(autocomplete) => {
              console.log('autocomplete loaded', autocomplete);
              autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={handlePlaceChange}
            className="w-full flex items-center justify-center"
          >
            <input
              type="text"
              placeholder="Input a location name"
              className="w-full rounded px-2 py-1 border"
            />
          </Autocomplete>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={searchLatLng || DEFAULT_LOCATION_LATLNG}
            zoom={14}
            // onUnmount={onUnmount}
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
                  />
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
