import { FC, useEffect, useState } from "react";
import { ICameraPanePredictionProps } from "./interface";
import { Button, Spin } from "antd";
import { predictAllAspects } from "@/apis/predict";

const CameraPrediction: FC<ICameraPanePredictionProps> = ({ cameraId, setParentDisable }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [predictions, setPredictions] = useState({
        velocity: "null",
        density: "Coming soon",
        condition: "Coming soon"
    })

    const fetchPredictions = async () => {
        setIsLoading(true)
        setParentDisable(true);
        await predictAllAspects(cameraId)
            .then((res) => {
                if (!res) return;

                setPredictions({
                    velocity: res.velocity || "null",
                    density: res.density || "Coming soon",
                    condition: res.condition || "Coming soon"
                })
            }).finally(() => {
                setParentDisable(false);
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

    return <div className="flex flex-col gap-4 items-center justify-center sm:mt-[12px]">
        <div className="font-bold">Current traffic estimation</div>
        <div className="flex flex-col gap-4">
            <p>Recommended velocity: <span>{Math.ceil(Number(velocity)) || "Calculating"} km/h</span></p>
            <p>Density: <span className="text-blue-400">{density}</span></p>
            <p>Condition: <span className="text-blue-400">{condition}</span></p>
            <Button className="text-white" onClick={() => fetchPredictions()}>Estimate again</Button>
        </div>
    </div>
}

export default CameraPrediction;