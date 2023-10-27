import { Dispatch, SetStateAction } from "react";

export interface ICameraPaneSelection {
    type: "id" | "address";
    value: string;
    cameraId: string;
}

export interface ICameraPaneAutocompleteProps {
    parentDisable?: boolean;
    onSelect: (value: string) => void,
}

export interface ICameraPaneImageProps {
    cameraId: string;
}

export interface ICameraPaneDetailProps {
    cameraId: string;
    setParentDisable: Dispatch<SetStateAction<boolean>>;
    // TODO: add more predict options
}


export interface ICameraPanePredictionProps {
    cameraId: string;
    setParentDisable: Dispatch<SetStateAction<boolean>>;
    // TODO: add more predict options
}