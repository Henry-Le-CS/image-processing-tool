'use client';

import { useEffect, useState } from 'react';
import CameraList from '../../data/cameras.json';

const CAMERA_URL = 'http://giaothong.hochiminhcity.gov.vn/expandcameraplayer/';

export default function Home() {
  const [currentCameraId, setCurrentCameraId] = useState<string>('');
  const [currentCameraUrl, setCurrentCameraUrl] = useState<string>(
    `${CAMERA_URL}?camId=${CameraList[0].cameraId}`
  );

  const handleChooseCamera = (id: string) => {
    setCurrentCameraId(id);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('camId', currentCameraId);
    console.log('new params', params.toString());
    setCurrentCameraUrl(CAMERA_URL + '?' + params.toString());
  }, [currentCameraId]);

  return (
    <div className="flex flex-col justify-center items-center p-4 gap-4">
      <div className="flex flex-wrap max-w-[80%] justify-center items-center bg-blue-100 h-[40vh] overflow-y-scroll p-2 rounded-lg gap-4">
        {CameraList.map((camera) => (
          <div
            key={camera.cameraId}
            className="w-[320px] bg-blue-300 p-2 rounded-md hover:bg-blue-400 hover:cursor-pointer"
            onClick={() => handleChooseCamera(camera.cameraId)}
          >
            <div>
              <p>{camera.locationName}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-[60%] p-4 rounded-lg bg-blue-100">
        <iframe
          src={currentCameraUrl}
          title="Real-time Camera view:"
          className="w-full aspect-[4/3]"
        ></iframe>
      </div>
    </div>
  );
}
