'use client';

import { libraries } from '@/components/MapPane/constants';
import {
  useLoadScript,
  GoogleMap,
  Autocomplete,
  Marker,
  CircleF,
} from '@react-google-maps/api';
import { useRef, useState } from 'react';
// import { useCallback, useState } from 'react';

const containerStyle = {
  width: '800px',
  height: '500px',
};

const center = {
  lat: 10.77231740416534,
  lng: 106.65797689722078,
};

const DEFAULT_RADIUS = 2000;

export default function Home() {
  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyClU-_Z-y35WQyasQ5C40OmWCAHUd21sWc',
    libraries,
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<
    google.maps.places.PlaceResult | undefined
  >();
  const [searchLatLng, setSearchLatLng] = useState<google.maps.LatLngLiteral>();
  // const [address, setAddress] = useState('');

  // const [currentLoc, setCurrentLoc] = useState();

  // google.maps.Circle.prototype.contains = function (latLng) {
  //   return (
  //     this.getBounds().contains(latLng) &&
  //     google.maps.geometry.spherical.computeDistanceBetween(
  //       this.getCenter(),
  //       latLng
  //     ) <= this.getRadius()
  //   );
  // };

  const isInsideCircle = (
    center: google.maps.LatLngLiteral,
    latLng: google.maps.LatLngLiteral
  ) => {
    console.log(
      'center -',
      searchLatLng,
      'pos -',
      latLng,
      'range -',
      DEFAULT_RADIUS
    );
    return (
      // circle.getBounds()?.contains(latLng) &&
      google.maps.geometry.spherical.computeDistanceBetween(center, latLng) <=
      DEFAULT_RADIUS
    );
  };

  // const circle = new google.maps.Circle({
  //   center: searchLatLng,
  //   radius: DEFAULT_RADIUS,
  // });

  if (isLoaded && searchLatLng) {
    console.log(
      'check',
      isInsideCircle(
        searchLatLng as google.maps.LatLngLiteral,
        searchLatLng as google.maps.LatLngLiteral
      )
    );
  }

  // const [map, setMap] = useState(null);

  // const onLoad = useCallback((map) => {
  //   console.log('on callback');
  //   setMap(map);
  // }, []);

  // const onUnmount = useCallback((map) => setMap(null), []);

  const handlePlaceChange = () => {
    const place = autocompleteRef.current?.getPlace();
    console.log('place changed', place);
    setSelectedPlace(place);
    setSearchLatLng({
      lat: place?.geometry?.location?.lat(),
      lng: place?.geometry?.location?.lng(),
    } as google.maps.LatLngLiteral);
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
              </>
            )}
          </GoogleMap>
        </div>
      )}
    </>
  );
}
