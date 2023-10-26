'use client';

import {
  useLoadScript,
  GoogleMap,
  Autocomplete,
  Marker,
  CircleF,
} from '@react-google-maps/api';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

const containerStyle = {
  width: '800px',
  height: '500px',
};

const center = {
  lat: 10.77231740416534,
  lng: 106.65797689722078,
};

interface IRawCameraData {
  address: string;
  latitude: string;
  longitude: string;
  camera_id: string;
}

interface ICameraData {
  address: string;
  lat: number;
  lng: number;
  cameraId: string;
}

const DEFAULT_RADIUS = 2000;

const CAMERA_LIST_ENDPOINT =
  'https://us-central1-image-labelling-web.cloudfunctions.net/app/api/camera/list?pageSize=200&currentPage=3';

export default function MapView() {
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
  const [camerasInRange, setCamerasInRange] = useState<ICameraData[]>([]);

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
        <div className="w-full p-4 bg-blue-200 flex flex-col gap-2 justify-center items-center">
          <Autocomplete
            onLoad={(autocomplete) => {
              console.log('autocomplete loaded', autocomplete);
              autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={handlePlaceChange}
            className="w-full flex items-center justify-center"
          >
            <input type="text" className="w-[80%]" />
          </Autocomplete>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={searchLatLng || center}
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
}
