import { FC, useCallback, useEffect, useState } from "react";
import { ILocationOptions, IMapAutocompleteOptions, IMapSearchBar, IMapVertical } from "./type";
import { AutoComplete, Button } from "antd";
import { useDebounce } from "@/hooks/useDebounce";
import { IBKLocationOptions } from "@/apis/interfaces";
import { fetchLocationOptions } from "@/apis/map";
import { DEFAULT_RADIUS } from "./constants";
import { GoToIcon } from "../Common/GoToIcon";
import { MarkerIcon } from "../Common/MarkerIcon";

export const MapSearchBar: FC<IMapSearchBar> = ({
    cameras,
    currentView,
    setSelectedPlaceLatLng,
    setCurrentView,
    setSearchLatLng,
    setCamerasInRange,
    setSelectedPlace,
    setSearchDestinationLatLng,
}) => {

    const [text, setText] = useState('');
    const [options, setOptions] = useState<IMapAutocompleteOptions>({
        start: [],
        destination: []
    }); // Used for autocomplete component
    const [locationOptions, setLocationOptions] = useState<ILocationOptions>({
        "start": undefined,
        "destination": undefined
    }); // Used for retrieving lat lng


    const [destinationText, setDestinationText] = useState('');

    const debouncedValue = useDebounce(text, 500);
    const debouncedDestinationValue = useDebounce(destinationText, 500);

    const generateAutocomplateOptions = (options?: IBKLocationOptions, vertical: IMapVertical = "start") => {
        if (!options) return [];

        const items = options?.items || [];
        const autocompleteOptions = items.map((item) => item.title);

        setOptions(prevOptions => {
            return {
                ...prevOptions,
                [vertical]: autocompleteOptions
            }
        })
    };

    const findLocationCoordinate = (location: string, vertical: IMapVertical) => {
        const items = locationOptions[vertical]?.items || [];
        const foundItem = items.find((item) => item.title === location);

        return foundItem?.position;
    };

    const onSelect = (value: string, vertical: IMapVertical) => {
        if (currentView == "circle") {
            handleSearchCircleView(value, vertical);
        }
        else {
            handleSearchRouteView(value, vertical);
        }
    };

    const getSearchPlaceLatLng = (value: string, vertical: IMapVertical) => {
        const searchPlaceLatLng = findLocationCoordinate(value, vertical);
        return searchPlaceLatLng as google.maps.LatLngLiteral;
    }


    const setCamerasInCircleRange = (searchPlaceLatLng: google.maps.LatLngLiteral) => {
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

    const handleSearchCircleView = (value: string, vertical: IMapVertical) => {
        const searchPlaceLatLng = getSearchPlaceLatLng(value, vertical);

        setSearchLatLng(searchPlaceLatLng);
        setSelectedPlaceLatLng(searchPlaceLatLng)

        setSelectedPlace(value);
        setText(value);

        setCamerasInCircleRange(searchPlaceLatLng);
    }

    const handleSearchRouteView = (value: string, vertical: IMapVertical) => {
        const searchPlaceLatLng = getSearchPlaceLatLng(value, vertical);

        if (vertical == "start") {
            setSearchLatLng(searchPlaceLatLng);
            setSelectedPlace(value);
            setText(value);
        }
        else {
            setSearchDestinationLatLng(searchPlaceLatLng);
            setDestinationText(value);
        }
    }

    const fetchLocationWithVertical = useCallback(async (value: string, vertical: IMapVertical) => {
        const options = await fetchLocationOptions({
            location: value,
        });

        setLocationOptions(prevOptions => {
            return {
                ...prevOptions,
                [vertical]: options
            }
        });
        generateAutocomplateOptions(options, vertical);
    }, [])

    useEffect(() => {
        if (!debouncedValue) return;

        fetchLocationWithVertical(debouncedValue, "start");
    }, [debouncedValue, fetchLocationWithVertical]);


    useEffect(() => {
        if (!debouncedDestinationValue) return;

        fetchLocationWithVertical(debouncedDestinationValue, "destination");
    }, [debouncedDestinationValue, fetchLocationWithVertical])

    if (currentView === 'circle') {
        return <div className="w-full flex gap-2">
            <AutoComplete
                className="w-full"
                placeholder="Enter a location"
                value={text}
                options={options["start"].map((value) => ({ value }))}
                onSelect={(value) => onSelect(value, "start")}
                onSearch={(value) => setText(value)}
            />
            <Button
                onClick={() => {
                    setCurrentView('route')
                    setCamerasInRange([])
                    setSearchDestinationLatLng(undefined)
                    setDestinationText('')
                }}
                className="flex items-center justify-center w-[35px] shadow-none"
            >
                <GoToIcon fill="#fff" ></GoToIcon>
            </Button>
        </div>
    }

    return <div className="w-full flex flex-row gap-2">
        <div className="w-full flex flex-col gap-2">
            <AutoComplete
                className="w-full"
                placeholder="Enter a starting location"
                value={text}
                options={options["start"].map((value) => ({ value }))}
                onSelect={(value) => onSelect(value, "start")}
                onSearch={(value) => setText(value)}
            />

            <AutoComplete
                className="w-full"
                placeholder="Enter a destination location"
                value={destinationText}
                options={options["destination"].map((value) => ({ value }))}
                onSelect={(value) => onSelect(value, "destination")}
                onSearch={(value) => setDestinationText(value)}
            />
        </div>
        <div className="flex items-center justify-center gap-2">
            <Button
                onClick={() => {
                    setCurrentView('circle')
                    setCamerasInRange([])
                    setSearchDestinationLatLng(undefined)
                    setDestinationText('')
                }}
                className="flex items-center justify-center w-[35px] shadow-none"
            >
                <MarkerIcon fill="#fff" />
            </Button>
        </div>
    </div>
}