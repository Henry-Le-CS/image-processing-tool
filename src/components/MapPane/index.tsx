'use client';

import { useState } from 'react';
import { ICameraData } from './type';
import { Col, Row } from 'antd';
import CameraStatistic from './CameraStatistic';
import MapView from './MapView';

export default function MapPane() {
  const [camerasInRange, setCamerasInRange] = useState<ICameraData[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');

  return (
    <>
      <Row className="w-full md:min-w-[90vw] flex gap-2">
        <Col flex={2} className="rounded border p-2 max-w-[40%]">
          <CameraStatistic
            selectedCameraId={selectedCameraId}
            cameras={camerasInRange}
            setSelectedCameraId={setSelectedCameraId}
          />
        </Col>
        <Col flex={3} className="rounded border p-2">
          <MapView
            selectedCameraId={selectedCameraId}
            setSelectedCameraId={setSelectedCameraId}
            camerasInRange={camerasInRange}
            setCamerasInRange={setCamerasInRange}
          />
        </Col>
      </Row>
    </>
  );
}
