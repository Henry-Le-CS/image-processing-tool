import {
  CircleF,
  GoogleMap,
  Marker,
  useLoadScript,
} from '@react-google-maps/api';
import { AutoComplete, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import { ICameraData, IMapView, IRawCameraData } from './type';
import {
  CAMERA_LIST_ENDPOINT,
  DEFAULT_LOCATION_LATLNG,
  DEFAULT_RADIUS,
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

  const [text, setText] = useState('');
  const [options, setOptions] = useState<string[]>([]); // Used for autocomplete component
  const [locationOptions, setLocationOptions] = useState<IBKLocationOptions | undefined>(undefined) // Used for retrieving lat lng

  const debouncedValue = useDebounce(text, 500);

  const generateAutocomplateOptions = (options?: IBKLocationOptions) => {
    if (!options) return [];

    const items = options?.items || [];
    const autocompleteOptions = items.map((item) => item.title);

    setOptions(autocompleteOptions);
  }

  const findLocationCoordinate = (location: string) => {
    const items = locationOptions?.items || [];
    const foundItem = items.find((item) => item.title === location);

    return foundItem?.position;
  }

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
          google.maps
            .geometry.spherical
            .computeDistanceBetween(
              searchPlaceLatLng,
              {
                lat,
                lng,
              }
            ) <= DEFAULT_RADIUS
      );

      setCamerasInRange(placesInRange);
    }
  }

  useEffect(() => {
    if (!debouncedValue) return;

    const fetchLocation = async () => {
      const options = await fetchLocationOptions({
        location: debouncedValue,
      });

      setLocationOptions(options);
      generateAutocomplateOptions(options);
    }

    fetchLocation();

  }, [debouncedValue])

  return (
    <>
      {!isLoaded && <div>Loading...</div>}
      {isLoaded && (
        <div className="w-full flex flex-col gap-2 justify-center items-center">
          <Typography.Title level={5} className="m-0">
            Map View
          </Typography.Title>
          <AutoComplete
            className='w-full'
            placeholder="Input a location name"
            value={text}
            options={options.map((value) => ({ value }))}
            onSelect={onSelect}
            onSearch={(value) => setText(value)}
          />
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={searchLatLng || DEFAULT_LOCATION_LATLNG}
            zoom={14}
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
