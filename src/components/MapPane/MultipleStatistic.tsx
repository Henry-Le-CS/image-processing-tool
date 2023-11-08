import { Col, Row, Typography } from 'antd';
import { FC } from 'react';
import { ICameraStatistic } from './type';
import { CameraControl } from './CameraControl';

const MultipleStatistic: FC<ICameraStatistic> = ({
  cameras,
  selectedCameraId,
  isPaused,
  isFetchingPrediction,
  setIsPaused,
  handleSwapPrevCamera,
  handleClearTimeout,
  handleSwapCamera
}) => {
  return (
    <div className='flex flex-col gap-2'>
      <Row className="flex justify-between items-center w-full">
        <Col className='flex flex-row items-center gap-5'>
          <Typography.Text strong>
            Camera
            {` (${cameras.findIndex((c) => c.cameraId == selectedCameraId) + 1
              }/${cameras.length})`}
            :
          </Typography.Text>
        </Col>
        <Col>
          <Typography>
            {cameras.find((c) => c.cameraId === selectedCameraId)?.address}
          </Typography>
        </Col>
      </Row>
      {
        selectedCameraId &&
        <CameraControl
          isPaused={isPaused}
          isFetchingPrediction={isFetchingPrediction}
          setIsPaused={setIsPaused}
          handleSwapPrevCamera={handleSwapPrevCamera}
          handleClearTimeout={handleClearTimeout}
          handleSwapCamera={handleSwapCamera}
        />
      }
    </div>
  );
};

export default MultipleStatistic;
