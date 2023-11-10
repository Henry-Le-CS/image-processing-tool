'use client';

import { useState } from 'react';
import { ICameraData } from './type';
import CameraStatistic from './CameraStatistic';
import MapView from './MapView';

export default function MapPane() {
  const [camerasInRange, setCamerasInRange] = useState<ICameraData[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');

  return (
    <>
      <div className="w-[90vw] flex md:gap-2 gap-4 flex-col-reverse sm:flex-row h-max">
        <div className="w-full rounded border p-2 md:max-w-[40%]">
          <CameraStatistic
            selectedCameraId={selectedCameraId}
            cameras={camerasInRange}
            setSelectedCameraId={setSelectedCameraId}
          />
        </div>
        <div className="w-full rounded border p-2">
          <MapView
            selectedCameraId={selectedCameraId}
            setSelectedCameraId={setSelectedCameraId}
            camerasInRange={camerasInRange}
            setCamerasInRange={setCamerasInRange}
          />
        </div>
      </div>
    </>
  );
}
