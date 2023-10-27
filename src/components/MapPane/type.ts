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
}

export interface IMapView {
  camerasInRange: ICameraData[];
  setCamerasInRange: Dispatch<SetStateAction<ICameraData[]>>;
}
