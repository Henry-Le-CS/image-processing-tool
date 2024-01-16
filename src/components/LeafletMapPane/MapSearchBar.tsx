import { AutoComplete, Typography } from 'antd';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  ILocationOptions,
  IMapAutocompleteOptions,
  IMapVertical,
} from './types';
import { IBKLocationOptions } from '@/apis/interfaces';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchLocationOptions } from '@/apis/map';
import { LatLng } from 'leaflet';

export default function MapSearchBar({
  setSearchLatLng,
  setSearchDestinationLatLng,
}: {
  setSearchLatLng: Dispatch<SetStateAction<LatLng | undefined>>;
  setSearchDestinationLatLng: Dispatch<SetStateAction<LatLng | undefined>>;
}) {
  const [text, setText] = useState('');
  const [destinationText, setDestinationText] = useState('');

  const [options, setOptions] = useState<IMapAutocompleteOptions>({
    start: [],
    destination: [],
  }); // Used for autocomplete component
  const [locationOptions, setLocationOptions] = useState<ILocationOptions>({
    start: undefined,
    destination: undefined,
  }); // Used for retrieving lat lng

  const debouncedValue = useDebounce(text, 500);
  const debouncedDestinationValue = useDebounce(destinationText, 500);

  const onSelect = (value: string, vertical: IMapVertical) => {
    handleSearchRouteView(value, vertical);
  };

  const generateAutocomplateOptions = (
    options?: IBKLocationOptions,
    vertical: IMapVertical = 'start'
  ) => {
    if (!options) return [];

    const items = options?.items || [];
    const autocompleteOptions = items.map((item) => item.title);

    setOptions((prevOptions) => {
      return {
        ...prevOptions,
        [vertical]: autocompleteOptions,
      };
    });
  };

  const findLocationCoordinate = (location: string, vertical: IMapVertical) => {
    const items = locationOptions[vertical]?.items || [];
    const foundItem = items.find((item) => item.title === location);

    return foundItem?.position;
  };

  const getSearchPlaceLatLng = (value: string, vertical: IMapVertical) => {
    const searchPlaceLatLng = findLocationCoordinate(value, vertical);
    return searchPlaceLatLng as LatLng;
  };

  const handleSearchRouteView = (value: string, vertical: IMapVertical) => {
    const searchPlaceLatLng = getSearchPlaceLatLng(value, vertical);

    if (vertical == 'start') {
      console.log('handling search route view', searchPlaceLatLng);
      setSearchLatLng(searchPlaceLatLng);
      // setSelectedPlace(value);
      setText(value);
    } else {
      console.log('handling search route view', searchPlaceLatLng);
      setSearchDestinationLatLng(searchPlaceLatLng);
      setDestinationText(value);
    }
  };

  const fetchLocationWithVertical = useCallback(
    async (value: string, vertical: IMapVertical) => {
      const options = await fetchLocationOptions({
        location: value,
      });

      setLocationOptions((prevOptions) => {
        return {
          ...prevOptions,
          [vertical]: options,
        };
      });
      generateAutocomplateOptions(options, vertical);
    },
    []
  );

  useEffect(() => {
    if (!debouncedValue) return;

    fetchLocationWithVertical(debouncedValue, 'start');
  }, [debouncedValue, fetchLocationWithVertical]);

  useEffect(() => {
    if (!debouncedDestinationValue) return;

    fetchLocationWithVertical(debouncedDestinationValue, 'destination');
  }, [debouncedDestinationValue, fetchLocationWithVertical]);

  return (
    <div className="w-full flex flex-row gap-2">
      <div className="w-full flex flex-col gap-2 items-center">
        <Typography.Text className="text-base font-semibold min-w-[40px]">
          Searching for routes
        </Typography.Text>

        <div className="flex w-full justify-start items-center gap-2 p-1">
          <Typography.Text className="text-sm font-semibold min-w-[40px]">
            From:
          </Typography.Text>
          <AutoComplete
            className="w-full"
            placeholder="Enter a starting location"
            value={text}
            options={options['start'].map((value) => ({ value }))}
            onSelect={(value) => onSelect(value, 'start')}
            onSearch={(value) => setText(value)}
          />
        </div>
        <div className="flex w-full justify-start items-center gap-2 p-1">
          <Typography.Text className="text-sm font-semibold min-w-[40px]">
            To:
          </Typography.Text>
          <AutoComplete
            className="w-full"
            placeholder="Enter a destination location"
            value={destinationText}
            options={options['destination'].map((value) => ({ value }))}
            onSelect={(value) => onSelect(value, 'destination')}
            onSearch={(value) => setDestinationText(value)}
          />
        </div>
      </div>
      {/* <div className="flex items-center justify-center gap-2">
        <Button
          onClick={() => {
            console.log('searching route');
          }}
          className="flex items-center justify-center w-[35px] shadow-none"
        >
          <MarkerIcon fill="#fff" />
        </Button>
      </div> */}
    </div>
  );
}
