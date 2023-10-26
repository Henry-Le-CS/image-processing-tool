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

    return <div className="flex flex-col items-center justify-center w-full md:min-w-[400px]">
        <Search selection={selection} onChange={setSelection} />
        {
            selection.cameraId &&
            <CameraDetail cameraId={selection.cameraId}></CameraDetail>
        }
    </div>
}

export default CameraPane;