import { IImageData } from "@/data/types";
import { selectImageList, selectOne } from "@/store/reducers/imageListReducer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { FC, HTMLAttributes, useMemo, useState } from "react";

export interface IImageCardProps extends HTMLAttributes<HTMLDivElement> {
    fileName: string;
    fileId: string;
}

const CardTitle: FC<IImageCardProps> = ({ fileName, fileId }) => {
    const images: {
        [key: string]: IImageData;
    } = useAppSelector(selectImageList);

    const isImageSelected = useMemo(() =>
        images[fileId]?.isSelected || false
        , [images, fileId])

    const cardDispatcher = useAppDispatch()

    const [isSelected, setIsSelected] = useState(isImageSelected);

    const handleRadioCheck = () => {
        setIsSelected(!isSelected);
        cardDispatcher(selectOne({
            fileId,
            isSelected: !isSelected
        }))
    }

    return <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{fileName}</p>
        <input type="checkbox" value={fileId} checked={isSelected} onChange={handleRadioCheck} />
    </div>
}

export default CardTitle
