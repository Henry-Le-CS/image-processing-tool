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
  setSelectedCameraId: Dispatch<SetStateAction<string>>;
}

export interface IMapView {
  camerasInRange: ICameraData[];
  selectedCameraId: string;
  setSelectedCameraId: Dispatch<SetStateAction<string>>;
  setCamerasInRange: Dispatch<SetStateAction<ICameraData[]>>;
}
