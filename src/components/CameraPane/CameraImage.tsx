import { Image } from "antd";
import { ICameraPaneImageProps } from "./interface";
import { FC, useEffect, useState } from "react";
import { fetchImageUrl } from "@/apis/camera";

const CameraImage: FC<ICameraPaneImageProps> = ({ cameraId, isFetchingSignal }) => {
    const [imageSrc, setImageSrc] = useState("");
    const [isFetchingImage, setIsFetchingImage] = useState(false);

    useEffect(() => {
        const fetchImageSrc = async () => {
            setIsFetchingImage(true);
            try {
                const src = await fetchImageUrl(cameraId);
                setImageSrc(src || "");
            } catch (err) {
                console.log(err);
                setImageSrc("");
            } finally {
                setIsFetchingImage(false);
            }
        }

        fetchImageSrc();
    }, [cameraId, isFetchingSignal]);

    return <div className="flex items-center justify-center">
        {isFetchingImage && <div>Loading image...   </div>}
        {imageSrc && !isFetchingImage && <Image loading="lazy" className="rounded-[16px] w-[90%] h-[300px] md:w-[750px] md:h-[400px]" src={imageSrc} alt="Fetched Image" />}
    </div>
}

export default CameraImage;