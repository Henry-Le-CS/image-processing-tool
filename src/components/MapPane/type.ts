import { IBKLocationOptions } from '@/apis/interfaces';
import { Dispatch, SetStateAction } from 'react';

export interface IRawCameraData {
  address: string;
  latitude: string;
  longitude: string;
  camera_id: string;
}

export interface ICameraData {
  address: string;
  lat: number;
  lng: number;
  cameraId: string;
}

export interface ICameraStatistic {
  cameras: ICameraData[];
  selectedCameraId: string;
  isPaused?: boolean;
  setIsPaused?: Dispatch<SetStateAction<boolean>>;
  handleClearTimeout?: () => void;
  handleSwapCamera?: () => void;
  handleSwapPrevCamera?: () => void;
  setSelectedCameraId: Dispatch<SetStateAction<string>>;
  isFetchingPrediction?: boolean;
}

export interface IMapView {
  camerasInRange: ICameraData[];
  selectedCameraId: string;
  setSelectedCameraId: Dispatch<SetStateAction<string>>;
  setCamerasInRange: Dispatch<SetStateAction<ICameraData[]>>;
}

export interface ICameraControl {
  isPaused?: boolean;
  setIsPaused?: Dispatch<SetStateAction<boolean>>;
  handleClearTimeout?: () => void;
  handleSwapCamera?: () => void;
  handleSwapPrevCamera?: () => void;
  isFetchingPrediction?: boolean;
}

export interface IMapSearchBar {
  cameras: ICameraData[];

  currentView: 'route' | 'circle';
  setCurrentView: Dispatch<SetStateAction<'route' | 'circle'>>;

  setSearchLatLng: Dispatch<SetStateAction<google.maps.LatLngLiteral | undefined>>;
  setSelectedPlace: Dispatch<SetStateAction<string>>;
  setCamerasInRange: Dispatch<SetStateAction<ICameraData[]>>;
  setSelectedPlaceLatLng: Dispatch<SetStateAction<google.maps.LatLngLiteral | undefined>>;

  setSearchDestinationLatLng: Dispatch<SetStateAction<google.maps.LatLngLiteral | undefined>>;
}

export type IMapVertical = "start" | "destination"

export interface ILocationOptions {
  start: IBKLocationOptions | undefined,
  destination: IBKLocationOptions | undefined
}

export interface IMapAutocompleteOptions {
  start: string[],
  destination: string[]
}