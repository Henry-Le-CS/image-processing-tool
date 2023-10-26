import { Input, Select } from "antd"
import { ICameraPaneSelection } from "./interface"
import { CAMERA_PANE_OPTIONS } from "./constants"
import Autocomplete from "./Autocomplete"

const Search = ({
    selection,
    onChange
}: {
    selection: ICameraPaneSelection,
    onChange: (value: ICameraPaneSelection) => void
}) => {
    const onSelectChange = (value: string) => onChange({
        value: "",
        type: value as "id" | "address",
        cameraId: ""
    })

    const isSearchingCameraId = selection.type === "id"

    return <div className="flex flex-col gap-2 md:flex md:flex-row">
        <Select
            className="min-w-[160px]"
            defaultValue={CAMERA_PANE_OPTIONS[0].value} // address
            onChange={onSelectChange}
            options={CAMERA_PANE_OPTIONS}
        />
        {
            isSearchingCameraId &&
            <Input
                type="text"
                className="indent-2 text-xs"
                value={selection.value}
                onChange={(e) => onChange({
                    ...selection,
                    value: e.target.value,
                    cameraId: e.target.value
                })}
                placeholder="Camera Id"
            />
        }
        {
            !isSearchingCameraId &&
            <Autocomplete
                onSelect={(value) => onChange({
                    ...selection,
                    value,
                    cameraId: value
                })}
            />
        }
    </div>
}

export default Search;