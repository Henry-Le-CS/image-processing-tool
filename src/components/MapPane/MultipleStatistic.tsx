import { Col, Row, Typography } from 'antd';
import { FC } from 'react';
import { ICameraStatistic } from './type';

const MultipleStatistic: FC<ICameraStatistic> = ({
  cameras,
  selectedCameraId,
}) => {
  return (
    <>
      <Row className="flex justify-between items-center w-full">
        <Col>
          <Typography.Text strong>
            Camera
            {` (${
              cameras.findIndex((c) => c.cameraId == selectedCameraId) + 1
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
    </>
  );
};

export default MultipleStatistic;
