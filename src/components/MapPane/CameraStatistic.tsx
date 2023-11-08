import { Row, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import { ICameraData, ICameraStatistic } from './type';
import CameraPrediction from '../CameraPane/CameraPrediction';
import CameraImage from '../CameraPane/CameraImage';
import Tab from '../Tab';
import IndividualStatistic from './IndividualStatistic';
import MultipleStatistic from './MultipleStatistic';

const CameraStatistic: FC<ICameraStatistic> = ({
  cameras,
  selectedCameraId,
  setSelectedCameraId,
}) => {
  const [isFetchingPrediction, setIsFetchingPrediction] =
    useState<boolean>(false);

  const [viewMode, setViewmode] = useState<string>('individual');

  useEffect(() => {
    console.log('ufx ran:', viewMode, selectedCameraId, isFetchingPrediction);
    const swapCameraId = (cameras: ICameraData[], id: string) => {
      const currentIdx = cameras.findIndex((c) => c.cameraId == id);
      return currentIdx == cameras.length - 1
        ? cameras[0].cameraId
        : cameras[currentIdx + 1].cameraId;
    };

    if (viewMode === 'interval' && selectedCameraId && !isFetchingPrediction) {
      const swapTimeout = setTimeout(() => {
        setSelectedCameraId(swapCameraId(cameras, selectedCameraId));
      }, 3000);
      return () => {
        console.log('timeout cleaned');
        clearTimeout(swapTimeout);
      };
    }
    return () => {
      console.log('ufx cleaned');
    };
  }, [isFetchingPrediction, viewMode, selectedCameraId]);

  return (
    <div className="flex flex-col gap-2 items-center">
      <Typography.Title level={5} className="m-0">
        Camera prediction
      </Typography.Title>
      <Tab
        items={[
          {
            key: 'individual',
            label: 'Individual View',
            children: (
              <IndividualStatistic
                cameras={cameras}
                setSelectedCameraId={setSelectedCameraId}
                selectedCameraId={selectedCameraId}
                isFetchingPrediction={isFetchingPrediction}
              />
            ),
          },
          {
            key: 'interval',
            label: 'Multiple Views',
            children: (
              // <div>hehe</div>
              <MultipleStatistic
                cameras={cameras}
                setSelectedCameraId={setSelectedCameraId}
                selectedCameraId={selectedCameraId}
              />
            ),
          },
        ]}
        className="m-0 w-full p-2"
        onChange={(key) => setViewmode(key)}
      />
      <Row className="flex justify-between items-center w-full">
        {/* <Col>
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
        </Col> */}
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
