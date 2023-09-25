import { Dispatch, FC, SetStateAction } from "react";
import { ImageNavigator, SelectedImage } from ".";

interface IImageContainerProps {
    urls: string[];
    currentUrlIndex: number;
    setCurrentUrlIndex: Dispatch<SetStateAction<number>>
}

const ImageContainer: FC<IImageContainerProps> = ({ urls, currentUrlIndex, setCurrentUrlIndex }) => {

    return (
        <div className="w-full flex flex-col gap-2 items-center justify-center">
            <SelectedImage url={urls[currentUrlIndex]} />
            <div className="flex gap-2">
                <ImageNavigator
                    currentIndex={currentUrlIndex}
                    imageCount={urls.length}
                    type="prev"
                    setUrlIndex={setCurrentUrlIndex}
                />
                <ImageNavigator
                    currentIndex={currentUrlIndex}
                    imageCount={urls.length}
                    type="next"
                    setUrlIndex={setCurrentUrlIndex}
                />
            </div>
        </div>
    )
}

export default ImageContainer;