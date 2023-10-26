import { FC } from "react";
import CameraImage from "./CameraImage";
import { ICameraPaneDetailProps } from "./interface";
import CameraPrediction from "./CameraPrediction";

const CameraDetail: FC<ICameraPaneDetailProps> = ({ cameraId }) => {
    return <div className="flex flex-col lg:flex-row lg:gap-4 lg:items-start">
        <CameraImage cameraId={cameraId} />
        <CameraPrediction cameraId={cameraId} />
    </div>
}

export default CameraDetail;