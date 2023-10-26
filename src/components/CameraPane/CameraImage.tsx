import { ICameraPaneImageProps } from "./interface";
import { LIVE_IMAGE_ENDPOINT } from "./constants";
import { FC } from "react";

const CameraImage: FC<ICameraPaneImageProps> = ({ cameraId }) => {

    const url = LIVE_IMAGE_ENDPOINT + cameraId

    return <div className="relative flex items-center justify-center">
        <div className="absolute bg-white w-[90%] h-[15px] top-0 md:w-[550px] md:h-[20px] z-1">
            {/* hide null and zoom button */}
        </div>
        <iframe className="w-[90%] h-[300px] md:w-[550px] md:h-[400px]" src={url}></iframe>
        <div className="absolute bottom-[0]  w-[90%] h-[45px] bg-white md:w-[550px] md:h-[50px] z-1">
            {/* hide null and zoom button */}
        </div>
    </div>
}

export default CameraImage;