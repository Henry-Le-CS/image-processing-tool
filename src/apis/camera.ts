import axios from "axios"
import { IFetchListCameraResult, ISearchAddressResult } from "./interface"

const CAMERA_URL = process.env.NEXT_PUBLIC_END_POINT

export const fetchListCameraByAddress = async (address: string): Promise<ISearchAddressResult | undefined> => {
    try {
        const endpoint = `${CAMERA_URL}/api/camera/search?address=${address}`
        const res = await axios.get(endpoint)

        return res.data
    }
    catch (error) {
        return undefined
    }
}

export const fetchListCamera = async (pageSize: number, currentPage: number): Promise<IFetchListCameraResult> => {
    try {
        const endpoint = `${CAMERA_URL}/api/camera/list?pageSize=${pageSize}&currentPage=${currentPage}`
        const res = await axios.get(endpoint)

        return res.data
    }
    catch (error) {
        return {
            cameraList: [],
            hasMore: false
        }
    }
}

export const fetchImageUrl = async (cameraId: string): Promise<string | undefined> => {
    try {
        const endpoint = process.env.NEXT_PUBLIC_MODEL_ENDPOINT + `/api/get_image/${cameraId}`;

        const response = await fetch(endpoint);
        const dataUrl = await response.text();

        return dataUrl;
    } catch (error) {
        return ""
    }
}