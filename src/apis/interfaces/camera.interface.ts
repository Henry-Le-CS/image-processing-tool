interface IAddressItem {
    address: string,
    latitude: string,
    camera_id: string,
    longitude: string
}

interface ISearchAddressItemResult {
    item: IAddressItem,
    refIndex?: number
}

export interface ISearchAddressResult {
    options: ISearchAddressItemResult[]
}

export interface IFetchListCameraResult {
    cameraList: IAddressItem[],
    hasMore: boolean
}
