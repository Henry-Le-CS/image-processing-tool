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