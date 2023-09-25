import { folderUrlParse, shuffleImage } from "@/components/ImageGrid/helper";
import { IImageData } from "@/data/types";
import { STRINGS } from "@/lib/strings";
import { resetOne, selectImageList, setAll, updateOne } from "@/store/reducers/imageListReducer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import axiosClient from "@/utils/axiosClient";
import { Form } from "antd";
import { useState } from "react";

const useHandleImage = () => {
    const [openModal, setOpenModal] = useState<string>('');
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [srcFolderUrl, setSrcFolderUrl] = useState<string | undefined>(
        process.env.NEXT_PUBLIC_SOURCE_FOLDER
    );
    const [form] = Form.useForm();

    const images: {
        [key: string]: IImageData;
    } = useAppSelector(selectImageList);

    const dispatchImgAction = useAppDispatch();

    const handleApplyChanges = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                dispatchImgAction(
                    updateOne({
                        id: openModal ?? '',
                        data: {
                            condition: values.condition,
                            density: Number(values.density),
                            velocity: Number(values.velocity),
                        },
                    })
                );
                setOpenModal('');
            })
            .catch((err) => {
                console.log('Validation failed', err);
            });
    };

    const handleCancelChanges = () => {
        if (openModal && images[openModal].isModified) {
            if (confirm(STRINGS.confirm.cancel)) {
                form.resetFields();
                dispatchImgAction(resetOne(openModal));
                setOpenModal('');
            }
            return;
        }
        form.resetFields();
        setOpenModal('');
    };

    const formatNewImageToImageDataObject = (
        fileId: string,
        fileName: string,
        url: string
    ): IImageData => ({
        fileId,
        fileName,
        url,
        isModified: false,
        trafficCondition: {},
    });

    const transformResponseDataToImageData = (
        data: Partial<Pick<IImageData, 'fileId' | 'fileName' | 'url'>>[]
    ) => {
        const newImages = data.reduce(
            (accumulator, currentImageInfo) => {
                if (
                    !(
                        currentImageInfo.fileId &&
                        currentImageInfo.fileId &&
                        currentImageInfo.url
                    )
                )
                    return accumulator;

                const { fileId, fileName, url } = currentImageInfo;
                const imageObject = formatNewImageToImageDataObject(
                    fileId,
                    fileName || '',
                    url
                );
                return {
                    ...accumulator,
                    [fileId]: imageObject,
                };
            },
            {} as {
                [key: string]: IImageData;
            }
        );

        return newImages;
    };

    const handleGenerateImages = async () => {
        setIsLoadingData(true);

        const srcFolderId = folderUrlParse(srcFolderUrl ?? '');

        try {
            const response = await axiosClient.get('/api/files', {
                params: {
                    folderId: srcFolderId,
                    pageSize: process.env.NEXT_PUBLIC_PAGE_SIZE ?? 20, // default
                },
            });
            if (!(response.data && response.data?.data)) {
                throw new Error(
                    'Cannot find any images, please reload the page or try again later'
                );
            }

            const {
                data,
            }: {
                data: Partial<Pick<IImageData, 'fileId' | 'fileName' | 'url'>>[];
                nextPageToken: string;
            } = response.data;

            const shuffledData = shuffleImage(data);
            const newlyGeneratedImages = transformResponseDataToImageData(
                shuffledData.slice(0, 20)
            );

            dispatchImgAction(
                setAll({
                    data: newlyGeneratedImages,
                })
            );
        } catch (err) {
            window.alert(err);
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleSubmitImages = async () => {
        const modifiedImages = Object.keys(images)
            .filter((fileId) => images[fileId].isModified)
            // Get the images
            .map((fileId) => images[fileId]);

        if (!modifiedImages.length) {
            window.alert('No image is currently modified');
            return;
        }

        const userAgreeToSubmit = window.confirm(
            'Are you sure you want to submit these images?'
        );

        if (!userAgreeToSubmit) {
            return;
        }

        setIsLoadingData(true);
        const srcFolderId = folderUrlParse(srcFolderUrl ?? '');

        try {
            const response = await axiosClient.patch('/api/files/rename', {
                data: modifiedImages,
                sourceFolder: srcFolderId,
                destinationFolder: process.env.NEXT_PUBLIC_DESTINATION_FOLDER,
            });

            if (response.status != 200) {
                throw new Error(response.data || 'Unrecognized error occured');
            }
        } catch (err) {
            window.alert(err);
            return;
        } finally {
            setIsLoadingData(false);
        }

        // If changes are made, we need to reload the page
        handleGenerateImages();
        window.alert('Save label to new images sucessfully');
    };

    return {
        images,
        form,
        openModal,
        isLoadingData,
        setOpenModal,
        setSrcFolderUrl,
        handleApplyChanges,
        handleCancelChanges,
        handleSubmitImages,
        handleGenerateImages,
    }
}

export default useHandleImage;