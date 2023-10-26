export interface ICameraPaneSelection {
    type: "id" | "address";
    value: string;
    cameraId: string;
}

export interface ICameraPaneAutocompleteProps {
    onSelect: (value: string) => void,
}

export interface ICameraPaneImageProps {
    cameraId: string;
}

export interface ICameraPaneDetailProps {
    cameraId: string;
    // TODO: add more predict options
}


export interface ICameraPanePredictionPropss {
    cameraId: string;
    // TODO: add more predict options
}