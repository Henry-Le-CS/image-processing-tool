import { useState } from "react";
import Search from "./Search";
import { ICameraPaneSelection } from "./interface";
import CameraDetail from "./CameraDetail";


const CameraPane = () => {
    const [selection, setSelection] = useState<ICameraPaneSelection>({
        type: "address",
        value: "",
        cameraId: ""
    })
    const [parentDisable, setParentDisable] = useState(false)

    return <div className="flex flex-col gap-6 items-center justify-center w-full md:min-w-[400px]">
        <Search parentDisable={parentDisable} selection={selection} onChange={setSelection} />
        {
            selection.cameraId &&
            <CameraDetail setParentDisable={setParentDisable} cameraId={selection.cameraId}></CameraDetail>
        }
    </div>
}

export default CameraPane;