import { Button } from "antd";
import { FC, useEffect, useState } from "react";
import { PlayCircleOutlined, PauseCircleOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { ICameraControl } from "./type";

const CONTROL_BUTTON_CLASSNAME = "flex items-center justify-center w-[40px] h-[25px]"

export const CameraControl: FC<ICameraControl> = ({ isPaused, setIsPaused, isFetchingPrediction, handleSwapPrevCamera, handleClearTimeout, handleSwapCamera }) => {
    const [onNavigate, setOnNavigate] = useState(false);

    const handleOnClick = () => {
        const newPauseStatus = !isPaused;
        if (!setIsPaused) return;

        setIsPaused(newPauseStatus);
        setOnNavigate(true);

        // On paused
        if (newPauseStatus && handleClearTimeout) {
            handleClearTimeout();
        }
        // On play
        else if (handleSwapCamera) {
            handleSwapCamera();
        }
    }

    const handleOnSwapPrevCamera = () => {
        if (!handleSwapPrevCamera || !handleClearTimeout || !setIsPaused) return;

        handleSwapPrevCamera();

        // Pause the camera too
        handleClearTimeout();
        setIsPaused(true);
        setOnNavigate(true);
    }

    const handleOnSwapNextCamera = () => {
        if (!handleSwapCamera || !handleClearTimeout || !setIsPaused) return;

        handleSwapCamera();

        // Pause the camera too
        handleClearTimeout();
        setIsPaused(true);
        setOnNavigate(true);
    }

    useEffect(() => {
        if (!onNavigate) return;


        if (isFetchingPrediction) {
            return;
        }
        else {
            setOnNavigate(false);
        }

    }, [isFetchingPrediction])
    // Do not include onNavigate in the dependency array. It would result in a misbehaviour

    return <div className="flex flex-row items-center justify-center gap-2">
        <Button
            disabled={onNavigate}
            className={CONTROL_BUTTON_CLASSNAME}
            onClick={handleOnSwapPrevCamera}>
            <LeftOutlined className="text-white" />
        </Button>
        <Button
            disabled={onNavigate}
            className={CONTROL_BUTTON_CLASSNAME}
            onClick={handleOnClick}>
            {
                isPaused ?
                    <PlayCircleOutlined className="text-white" /> :
                    <PauseCircleOutlined className="text-white" />
            }
        </Button>
        <Button
            disabled={onNavigate}
            className={CONTROL_BUTTON_CLASSNAME}
            onClick={handleOnSwapNextCamera}
        >
            <RightOutlined className="text-white" />
        </Button>
    </div>
}