import { FC, useState } from "react";
import CameraImage from "./CameraImage";
import { ICameraPaneDetailProps } from "./interface";
import CameraPrediction from "./CameraPrediction";

const CameraDetail: FC<ICameraPaneDetailProps> = ({ cameraId, setParentDisable }) => {
    const [isFetchingSignal, setIsFetchingSignal] = useState(false);

    return <div className="flex flex-col lg:flex-row lg:gap-4 lg:items-start">
        <CameraImage
            isFetchingSignal={isFetchingSignal}
            cameraId={cameraId}
        />
        <CameraPrediction
            setIsFetchingSignal={setIsFetchingSignal}
            cameraId={cameraId}
            setParentDisable={setParentDisable}
        />
    </div>
}

export default CameraDetail;