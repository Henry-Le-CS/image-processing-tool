import { FC, useEffect, useState } from "react";
import { ICameraPanePredictionProps } from "./interface";
import { Button, Spin } from "antd";
import { predictAllAspects } from "@/apis/predict";
import { CONDITION_MAPPING, CONDITION_STATUS_CLASSNAME, DENSITY_MAPPING, DENSITY_STATUS_CLASSNAME } from "./constants";

const CameraPrediction: FC<ICameraPanePredictionProps> = ({ cameraId, setParentDisable, setIsFetchingSignal }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [predictions, setPredictions] = useState({
        velocity: "null",
        density: "Coming soon",
        condition: "Coming soon"
    })

    const fetchPredictions = async () => {
        setIsLoading(true)
        setParentDisable(true);

        setIsFetchingSignal(value => !value)

        await predictAllAspects(cameraId)
            .then((res) => {
                if (!res) return;

                setPredictions({
                    velocity: res.velocity || "null",
                    density: res.density || "null",
                    condition: res.condition || "null"
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

    const densityClassName = DENSITY_STATUS_CLASSNAME[density as keyof typeof DENSITY_STATUS_CLASSNAME]
    const conditionClassName = CONDITION_STATUS_CLASSNAME[condition as keyof typeof CONDITION_STATUS_CLASSNAME]

    const densityText = DENSITY_MAPPING[density as keyof typeof DENSITY_MAPPING] || "null"
    const conditionText = CONDITION_MAPPING[condition as keyof typeof CONDITION_MAPPING] || "null"

    return <div className="flex flex-col gap-4 items-center justify-center sm:mt-[12px]">
        <div className="font-bold">Current traffic estimation</div>
        <div className="flex flex-col gap-4">
            <p>Density: <span className={densityClassName}>{densityText}</span></p>
            <p>Condition: <span className={conditionClassName}>{conditionText}</span></p>
            <p>Recommended velocity: <span>{Math.ceil(Number(velocity)) || "Calculating"} km/h</span></p>
            <Button className="text-white" onClick={() => fetchPredictions()}>Estimate again</Button>
        </div>
    </div>
}

export default CameraPrediction;