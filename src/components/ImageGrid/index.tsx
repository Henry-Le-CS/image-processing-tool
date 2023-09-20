import { Row, Col, Modal, Form, Button } from 'antd';
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
import { Spinner } from '../Spinner/spinner';

const ImageGrid: FC = () => {
  const [openModal, setOpenModal] = useState<string>("");
  const [nextPageTokenPagination, setNextPageTokenPagination] = useState("") // Use for pagination supported by google drive api
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [form] = Form.useForm();

  // TODO: Implement async api call here + dispatching the initial state
  const images: {
    [key: string]: IImageData
  } = useAppSelector(selectImageList);

  const dispatchImgAction = useAppDispatch();

  const handleApplyChanges = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        console.log('Submitted', openModal, values);
        dispatchImgAction(
          updateOne({
            id: openModal ?? "",
            data: {
              condition: values.condition,
              density: Number(values.density),
              velocity: Number(values.velocity),
            },

          })
        );
        setOpenModal("");
      })
      .catch((err) => {
        console.log('Validation failed', err);
      });
    console.log(form);
  };

  const handleCancelChanges = () => {
    if (openModal && images[openModal].isModified) {
      if (confirm(STRINGS.confirm.cancel)) {
        form.resetFields();
        dispatchImgAction(resetOne(openModal));
        setOpenModal("");
      }
      return;
    }
    form.resetFields();
    setOpenModal("");
  };

  const formatNewImageToImageDataObject = (fileId: string, fileName: string, url: string): IImageData => ({
    fileId,
    fileName,
    url,
    isModified: false,
    trafficCondition: {}
  })

  const transformResponseDataToImageData = (data: Partial<Pick<IImageData, "fileId" | "fileName" | "url">>[]) => {
    const newImages = data.reduce((accumulator, currentImageInfo) => {
      if (!(currentImageInfo.fileId && currentImageInfo.fileId && currentImageInfo.url))
        return accumulator

      const { fileId, fileName, url } = currentImageInfo
      const imageObject = formatNewImageToImageDataObject(fileId, fileName || "", url)
      return {
        ...accumulator,
        [fileId]: imageObject
      }
    }, {} as {
      [key: string]: IImageData
    })

    return newImages
  }

  const handleGenerateImages = async (isLoadingMore = false) => {
    setIsLoadingData(true)

    try {
      const response = await axiosClient.get('/api/files', {
        params: {
          folderId: process.env.NEXT_PUBLIC_SOURCE_FOLDER,
          pageSize: process.env.NEXT_PUBLIC_PAGE_SIZE ?? 20, // default
          nextPageToken: isLoadingMore ? nextPageTokenPagination : ""
        },
      });
      if (!(response.data && response.data?.data)) {
        throw new Error('Cannot find any images, please reload the page or try again later');
      }

      const { data, nextPageToken }: { data: Partial<Pick<IImageData, "fileId" | "fileName" | "url">>[], nextPageToken: string } = response.data
      setNextPageTokenPagination(nextPageToken);
      const newlyGeneratedImages = transformResponseDataToImageData(data)

      if (isLoadingMore) {
        const newImages = { ...images, ...newlyGeneratedImages }

        dispatchImgAction(setAll({
          data: newImages
        }));
        return;
      }

      dispatchImgAction(setAll({
        data: newlyGeneratedImages
      }));
    }
    catch (err) {
      window.alert(err);
    }
    finally {
      setIsLoadingData(false)
    }
  };

  const handleSubmitImages = async () => {
    const modifiedImages =
      Object.keys(images)
        .filter(fileId => images[fileId].isModified)
        // Get the images
        .map(fileId => images[fileId])

    if (!modifiedImages.length) {
      window.alert('No image is currently modified');
      return;
    }

    const userAgreeToSubmit = window.confirm('Are you sure you want to submit these images?')

    if (!userAgreeToSubmit) {
      return;
    }
    setIsLoadingData(true)
    try {
      const response = await axiosClient.patch('/api/files/rename', {
        data: modifiedImages,
        "sourceFolder": process.env.NEXT_PUBLIC_SOURCE_FOLDER,
        "destinationFolder": process.env.NEXT_PUBLIC_DESTINATION_FOLDER
      })

      if (response.status != 200) {
        throw new Error(response.data || "Unrecognized error occured")
      }
    }
    catch (err) {
      window.alert(err)
      return;
    }
    finally {
      setIsLoadingData(false)
    }

    window.alert('Save label to new images sucessfully');

    // If changes are made, we need to reload the page
    handleGenerateImages()
  }


  return (
    <Fragment>
      <div className="relative min-w-100 md:min-w-[50%] md:max-w-[80%] min-h-screen md:min-h-[60%] flex flex-col justify-center items-center bg-blue-100 rounded-md p-4 md:mt-8 gap-4">
        <div
          className="sticky top-0 flex flex-col md:flex-row gap-2 md:gap-4 w-full items-center justify-center py-4 drop-shadow-lg rounded-b-[12px] px-6"
          style={{
            zIndex: 201,
            backgroundColor: "rgb(219 234 254 / var(--tw-bg-opacity))", //bg-blue-100
          }}>
          <Button
            name='GenerateNewButton'
            className='w-full md:w-[40%]'
            type="primary"
            onClick={() => handleGenerateImages()}
            disabled={isLoadingData}
          >
            Generate Images
          </Button>
          {
            Object.keys(images).filter(fileId => images[fileId].isModified) &&
            <Button
              className='w-full md:w-[40%]'
              type="primary"
              onClick={handleSubmitImages}
              disabled={isLoadingData}
            >
              Submit Images
            </Button>
          }
        </div>
        {Object.keys(images).length > 0 && (
          <Row className='z-200'
            gutter={[
              { xs: 8, lg: 16 },
              { xs: 16, lg: 16 },
            ]}
          >
            {
              Object.entries(images).map(([fileId, img]) => (
                <Col key={fileId} xs={24} md={6}>
                  <ImageCard
                    filename={img.fileName}
                    id={''}
                    url={img?.url}
                    isModified={img?.isModified || false}
                    onClick={() => {
                      setOpenModal(img.fileId);
                    }}
                  />
                </Col>
              ))
            }
          </Row>
        )}
        {
          isLoadingData && (
            <Spinner></Spinner>
          )
        }
        <Button
          type="primary"
          className="bg-current w-full fixed bottom-0 md:w-auto md:block md:relative"
          name='LoadMoreButton'
          onClick={() => handleGenerateImages(true)}
          disabled={!nextPageTokenPagination || isLoadingData}
        >
          Load more image
        </Button>

      </div>
      <Modal
        title={`Rename image`}
        open={!!openModal}
        onOk={handleApplyChanges}
        onCancel={handleCancelChanges}
      >
        <LabelingForm form={form} formData={images[openModal]?.trafficCondition || {}} />
      </Modal>
    </Fragment>
  );
};

export default ImageGrid;
