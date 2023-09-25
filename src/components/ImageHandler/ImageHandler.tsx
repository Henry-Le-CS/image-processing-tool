import { IImageData } from "@/data/types"
import { deselectAll, resetAll, selectAll, selectImageList, updateSelected } from "@/store/reducers/imageListReducer"
import { useAppSelector } from "@/store/store"
import { Button, Modal } from "antd"
import { ChangeEvent, FC, HTMLAttributes, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { BatchLabelingForm } from "../BatchLabelingForm"
import { useForm } from "antd/es/form/Form"

interface IImageHandlerComponentProps extends HTMLAttributes<HTMLDivElement> {
    isLoading: boolean;
}

const ImageHandlerComponent: FC<IImageHandlerComponentProps> = ({ isLoading }) => {
    const images: {
        [key: string]: IImageData;
    } = useAppSelector(selectImageList)
    const [currentUrlIndex, setCurrentUrlIndex] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const handlerDispatch = useDispatch();
    const [form] = useForm();

    const selectedImages = useMemo(() =>
        Object
            .values(images)
            .filter((img) => img.isSelected),
        [images]
    )

    const hasModifiedImages = useMemo(() =>
        Object.values(images).some((img) => img.isModified), [images])

    const hasSelectedImages = selectedImages.length > 0;

    const handleOnCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        if (checked) {
            handlerDispatch(selectAll());
            return;

        }

        handlerDispatch(deselectAll());
    }

    const handleRevertChanges = () => {
        const isUserSure = window.confirm("Are you sure you want to revert all changes?");
        if (!isUserSure) return;

        handlerDispatch(resetAll());
    }

    const handleEditSelectedImages = () => {
        setShowModal(true);
    }

    const handleApplyChanges = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                const trafficCondition = {
                    condition: values.condition,
                    density: Number(values.density),
                    velocity: Number(values.velocity),
                }
                handlerDispatch(updateSelected({ data: trafficCondition }));
                setShowModal(false);
            })
    }

    return <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
        <div className="flex flex-row gap-2">
            <input type="checkbox" checked={hasSelectedImages} onChange={handleOnCheckboxChange} />
            {<p className="text-sm">Selecting {selectedImages.length} images</p>}
        </div>
        <div className="flex flex-row gap-2">
            <Button
                type="primary"
                onClick={handleEditSelectedImages}
                disabled={!hasSelectedImages || isLoading}
            >
                Edit selected images
            </Button>
            <Button
                className={
                    !(!(hasSelectedImages
                        ||
                        hasModifiedImages)
                        || isLoading)
                        ? "!bg-[#FF5C5C]" // Not disabled
                        : ""
                }
                type="primary"
                onClick={handleRevertChanges}
                disabled={!(hasSelectedImages || hasModifiedImages) || isLoading}
            >
                Revert all changes
            </Button>
        </div>
        <Modal
            title="Edit images"
            open={showModal}
            onCancel={() => {
                setShowModal(false)

                // This is a work around. 
                // The form does not reset the currentUrlIndex state when the modal is closed if we set the state in the children
                setCurrentUrlIndex(0);
            }}
            width={'720px'}
            onOk={handleApplyChanges}
        >
            <BatchLabelingForm
                currentUrlIndex={currentUrlIndex}
                setCurrentUrlIndex={setCurrentUrlIndex}
                form={form}
            />
        </Modal>
    </div>
}
export default ImageHandlerComponent