import axios from "axios";
import { IAllAspectsPredictionResult } from "./interfaces";

const PREDICT_MODEL_URL = process.env.NEXT_PUBLIC_MODEL_ENDPOINT
export const predictAllAspects = async (cameraId: string): Promise<IAllAspectsPredictionResult | undefined> => {
    try {
        const endpoint = `${PREDICT_MODEL_URL}/api/predict?camera_id=${cameraId}`
        const res = await axios.get(endpoint)

        return res.data
    }
    catch (error) {
        return undefined
    }
}