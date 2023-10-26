import { FC, useEffect, useState } from "react";
import { ICameraPanePredictionPropss } from "./interface";
import { Button, Spin } from "antd";
import { predictAllAspects } from "@/apis/predict";

const CameraPrediction: FC<ICameraPanePredictionPropss> = ({ cameraId }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [predictions, setPredictions] = useState({
        velocity: "null",
        density: "Coming soon",
        condition: "Coming soon"
    })

    const fetchPredictions = async () => {
        setIsLoading(true)
        await predictAllAspects(cameraId)
            .then((res) => {
                if (!res) return;

                setPredictions({
                    velocity: res.velocity || "null",
                    density: res.density || "Coming soon",
                    condition: res.condition || "Coming soon"
                })
            }).finally(() => {
                setIsLoading(false)
            })
    }

    const { velocity, condition, density } = predictions


    useEffect(() => {
        fetchPredictions().then(() => { })
    }, [cameraId])

    if (isLoading) {
        return <Spin className="mt-[-35px] md:mt-[-30px] lg:mt-[20px]" />
    }

    return <div style={{ zIndex: 5 }} className="w-full flex z-5 flex-col gap-2 items-center justify-center mt-[-35px] md:mt-[-30px] lg:mt-[20px]">
        <div className="w-full flex flex-col items-center justify-center gap-2 md:flex md:flex-row md:gap-4">
            <p>Velocity: <span>{Math.ceil(Number(velocity)) || "Calculating"}</span></p>
            <p>Density: <span className="text-blue-400">{density}</span></p>
        </div>
        <div className="flex flex-col gap-2">
            <p>Condition: <span className="text-blue-400">{condition}</span></p>
            <Button className="text-white" onClick={() => fetchPredictions()}>Re-estimate</Button>
        </div>
    </div>
}

export default CameraPrediction;