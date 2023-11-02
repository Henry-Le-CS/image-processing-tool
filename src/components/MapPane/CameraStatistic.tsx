import { Col, Row, Select, Typography } from 'antd';
import { FC, useState } from 'react';
import { ICameraStatistic } from './type';
import CameraPrediction from '../CameraPane/CameraPrediction';
import CameraImage from '../CameraPane/CameraImage';

const CameraStatistic: FC<ICameraStatistic> = ({ cameras, selectedCameraId, setSelectedCameraId }) => {
  const [isFetchingPrediction, setIsFetchingPrediction] =
    useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2 items-center">
      <Typography.Title level={5} className="m-0">
        Camera prediction
      </Typography.Title>
      <Row className="flex justify-between items-center w-full">
        <Col>
          <Typography>Camera:</Typography>
        </Col>
        <Col>
          <Select
            placeholder="Choose a camera in range"
            disabled={isFetchingPrediction}
            options={cameras.map((camera, id) => ({
              label: `${id + 1} - ${camera.address}`,
              value: camera.cameraId,
            }))}
            value={selectedCameraId}
            onChange={(val) => setSelectedCameraId(val as string)}
          />
        </Col>
      </Row>
      {selectedCameraId && (
        <div className="border flex flex-col gap-4 rounded p-2 mt-0">
          <CameraImage cameraId={selectedCameraId} />
          <CameraPrediction
            cameraId={selectedCameraId}
            setParentDisable={setIsFetchingPrediction}
          />
        </div>
      )}
    </div>
  );
};

export default CameraStatistic;
