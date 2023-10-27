import { Image } from "antd";
import { ICameraPaneImageProps } from "./interface";
import { FC, useEffect, useState } from "react";
import { fetchImageUrl } from "@/apis/camera";

const CameraImage: FC<ICameraPaneImageProps> = ({ cameraId }) => {
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        fetchImageUrl(cameraId)
            .then(src => setImageSrc(src || ""))
            .catch(err => {
                console.log(err);
                setImageSrc("")
            })
    }, [cameraId]);

    return <div className="flex items-center justify-center">
        {imageSrc && <Image loading="lazy" className="rounded-[16px] w-[90%] h-[300px] md:w-[750px] md:h-[400px]" src={imageSrc} alt="Fetched Image" />}
    </div>
}

export default CameraImage;