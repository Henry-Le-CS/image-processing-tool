// From UTraffic API
export interface IBKLocationSearchParameters {
    latitude?: string; // Center of the ring
    longitude?: string; // Center of the ring
    limit?: string;
    location: string;
}

export interface IBKLocationItem {
    title: string;
    position: {
        lat: number | string,
        lng: number | string,
    }
    // eslint-disable-next-line
    [key: string]: any; // Ignore other properties
}

export type IBKLocationItemBrief = Pick<IBKLocationItem, "title" | "position">;

export interface IBKLocationSearchDataResponse {
    items: Array<IBKLocationItem>;
}

export interface IBKLocationOptions {
    items: Array<IBKLocationItemBrief>;
}