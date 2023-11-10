import axios from "axios"
import { UTRAFFIC_API_KEY, UTRAFFIC_AT_COORD, UTRAFFIC_LOCATION_FETCHING_URL } from "./constants/map"
import { IBKLocationItemBrief, IBKLocationOptions, IBKLocationSearchDataResponse, IBKLocationSearchParameters } from "./interfaces"

export const fetchLocationOptions = async (
    {
        latitude,
        longitude,
        limit = "5",
        location
    }: IBKLocationSearchParameters
): Promise<IBKLocationOptions | undefined> => {
    try {
        const url = UTRAFFIC_LOCATION_FETCHING_URL

        const at = latitude && longitude ? `${latitude},${longitude}` : UTRAFFIC_AT_COORD;
        const q = location;
        const apikey = UTRAFFIC_API_KEY;

        const endpoint = `${url}at=${at}&limit=${limit}&apikey=${apikey}&q=${q}`
        const res = await axios.get(endpoint)

        if (res.status != 200) {
            throw new Error("Error when fetching location options")
        }

        const data: IBKLocationSearchDataResponse = res.data

        const items = data.items.reduce((acc, item) => {
            const { title, position } = item

            if (!title || !position) return acc;

            const label = item?.address?.label // Specific location

            return [...acc, { title: label || title, position }]

        }, [] as IBKLocationItemBrief[])

        return {
            items
        }
    }
    catch (err) {
        console.log(err)
    }
}