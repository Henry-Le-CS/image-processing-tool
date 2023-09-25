import { Button } from "antd";
import { Dispatch, FC, SetStateAction } from "react";
interface IImageNavigatorProps {
    currentIndex: number;
    imageCount: number;
    type: 'prev' | 'next';
    setUrlIndex: Dispatch<SetStateAction<number>>
}
const ImageNavigator: FC<IImageNavigatorProps> = ({ currentIndex, imageCount, type, setUrlIndex }) => {
    const isPrevNavigatorDisabled = currentIndex === 0;
    const isNextNavigatorDisabled = currentIndex === imageCount - 1;

    if (type == 'prev') {
        return <Button
            type="primary"
            onClick={() => setUrlIndex(currentIndex - 1)}
            disabled={isPrevNavigatorDisabled}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
            </svg>
        </Button>
    }

    return <Button
        type="primary"
        onClick={() => setUrlIndex(currentIndex + 1)}
        disabled={isNextNavigatorDisabled}
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
        </svg>
    </Button>
}

export default ImageNavigator