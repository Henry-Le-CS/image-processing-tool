import { Col, Row, Select, Typography } from 'antd';
import { FC } from 'react';
import { ICameraStatistic } from './type';

const IndividualStatistic: FC<ICameraStatistic> = ({
  cameras,
  selectedCameraId,
  setSelectedCameraId,
  isFetchingPrediction,
}) => {
  return (
    <>
      <Row className="flex justify-between items-center w-full">
        <Col>
          <Typography>Camera:</Typography>
        </Col>
        <Col className="">
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
    </>
  );
};

export default IndividualStatistic;
