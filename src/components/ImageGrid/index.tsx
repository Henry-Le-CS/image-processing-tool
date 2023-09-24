import { Row, Col, Modal, Form, Button, Spin, Input } from 'antd';
import ImageCard from '../ImageCard';
import { FC, Fragment, useState } from 'react';
import LabelingForm from '../LabelingForm';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  resetOne,
  selectImageList,
  setAll,
  updateOne,
} from '@/store/reducers/imageListReducer';
import { STRINGS } from '@/lib/strings';
import { IImageData } from '@/data/types';
import axiosClient from '@/utils/axiosClient';
import { folderUrlParse, shuffleImage } from './helper';

const ImageGrid: FC = () => {
  const [openModal, setOpenModal] = useState<string>('');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [srcFolderUrl, setSrcFolderUrl] = useState<string | undefined>(
    process.env.NEXT_PUBLIC_SOURCE_FOLDER
  );
  const [form] = Form.useForm();

  // TODO: Implement async api call here + dispatching the initial state
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

  return (
    <Fragment>
      <div className="relative min-w-100 w-full md:min-w-[50%] md:max-w-[80%] min-h-screen md:min-h-[60%] flex flex-col justify-center items-center bg-blue-100 rounded-md p-2 md:mt-8 gap-4">
        <div
          className="sticky top-0 flex flex-col md:flex-row gap-2 md:gap-4 w-full items-center justify-center py-4 drop-shadow-lg rounded-b-[12px] px-6"
          style={{
            zIndex: 201,
            backgroundColor: 'rgb(219 234 254 / var(--tw-bg-opacity))', //bg-blue-100
          }}
        >
          {Object.keys(images).length === 0 && (
            <div className="md:flex md:gap-4">
              <Input
                placeholder="Insert the source folder\'s url"
                onChange={(e) => setSrcFolderUrl(e.target.value)}
                onPressEnter={handleGenerateImages}
              />
              <Button
                name="GenerateNewButton"
                className="w-full md:w-[40%]"
                type="primary"
                onClick={handleGenerateImages}
                disabled={isLoadingData}
              >
                Generate Images
              </Button>
            </div>
          )}
          {Object.keys(images).length > 0 && (
            <Button
              className="w-full md:w-[40%]"
              type="primary"
              onClick={handleSubmitImages}
              disabled={
                isLoadingData ||
                !Object.keys(images).some((fileId) => images[fileId].isModified)
              }
            >
              Submit Images
            </Button>
          )}
        </div>
        {Object.keys(images).length > 0 && (
          <Row
            className="z-200 "
            gutter={[
              { xs: 8, md: 16 },
              { xs: 8, md: 16 },
            ]}
          >
            {Object.entries(images).map(([fileId, img]) => (
              <Col key={fileId} xs={24} md={6} className="px-4">
                <ImageCard
                  filename={img.fileName}
                  id={''}
                  url={img?.url}
                  isModified={img?.isModified || false}
                  onClick={() => {
                    setOpenModal(img.fileId);
                    3;
                  }}
                />
              </Col>
            ))}
          </Row>
        )}
        {isLoadingData && <Spin size="large" />}
      </div>
      <Modal
        title={`Rename image`}
        open={!!openModal}
        onOk={handleApplyChanges}
        onCancel={handleCancelChanges}
        width={'720px'}
        centered
      >
        <LabelingForm
          form={form}
          formData={images[openModal]?.trafficCondition || {}}
          imageUrl={images[openModal]?.url}
        />
      </Modal>
    </Fragment>
  );
};

export default ImageGrid;
