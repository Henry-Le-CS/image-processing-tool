import { Row, Typography } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
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
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const swapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // This function return the next camera id
  const swapCameraId = (cameras: ICameraData[], id: string) => {
    const currentIdx = cameras.findIndex((c) => c.cameraId == id);
    return currentIdx == cameras.length - 1
      ? cameras[0].cameraId
      : cameras[currentIdx + 1].cameraId;
  };

  const findPrevCameraId = (cameras: ICameraData[], currentId: string) => {
    const currentIdx = cameras.findIndex((c) => c.cameraId == currentId);
    return currentIdx == 0
      ? cameras[cameras.length - 1].cameraId
      : cameras[currentIdx - 1].cameraId;
  }

  const handleSwapPrevCamera = () => {
    const prevCameraId = findPrevCameraId(cameras, selectedCameraId);
    setSelectedCameraId(prevCameraId);
  }

  const handleClearTimeout = () => {
    if (!swapTimeoutRef.current) return;

    clearTimeout(swapTimeoutRef.current);
  }

  const handleSwapCamera = () => {
    if (!selectedCameraId) return;

    const cameraId = swapCameraId(cameras, selectedCameraId);
    setSelectedCameraId(cameraId);
  }

  useEffect(() => {
    console.log('ufx ran:', viewMode, selectedCameraId, isFetchingPrediction);

    if (viewMode === 'interval' && selectedCameraId && !isFetchingPrediction && !isPaused) {
      swapTimeoutRef.current = setTimeout(() => {
        handleSwapCamera();
      }, 3000);

      // clearTimeout(swapTimeoutRef.current);

      return () => {
        if (!swapTimeoutRef.current) return;

        console.log('timeout cleaned');
        clearTimeout(swapTimeoutRef.current);
      };
    }
    return () => {
      console.log('ufx cleaned');
    };
  }, [isFetchingPrediction, viewMode, selectedCameraId]);

  return (
    <div className="w-full flex flex-col gap-2 items-center">
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
              <MultipleStatistic
                cameras={cameras}
                isPaused={isPaused}
                setIsPaused={setIsPaused}
                handleClearTimeout={handleClearTimeout}
                handleSwapCamera={handleSwapCamera}
                handleSwapPrevCamera={handleSwapPrevCamera}
                setSelectedCameraId={setSelectedCameraId}
                selectedCameraId={selectedCameraId}
                isFetchingPrediction={isFetchingPrediction}
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
        <div className="w-full border flex flex-col gap-4 rounded p-2 mt-0">
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
