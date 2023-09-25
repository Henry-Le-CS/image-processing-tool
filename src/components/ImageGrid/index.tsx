import { Row, Col, Modal, Button, Spin, Input } from 'antd';
import ImageCard from '../ImageCard';
import { FC, Fragment } from 'react';
import LabelingForm from '../LabelingForm'
import { useHandleImage } from '@/hooks';
import { ImageHandler } from '../ImageHandler';

const ImageGrid: FC = () => {
  const {
    images,
    isLoadingData,
    openModal,
    form,
    handleSubmitImages,
    setOpenModal,
    handleApplyChanges,
    handleCancelChanges,
    handleGenerateImages,
    setSrcFolderUrl
  } = useHandleImage()

  const hasImages = Object.keys(images).length > 0;
  const hasModifiedImages = Object.keys(images).some((fileId) => images[fileId].isModified)
  const modifiedImageCount = Object.values(images).filter((img) => img.isModified).length;

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
          {!hasImages && (
            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
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
          {hasImages && (
            <div className='flex flex-col w-full lg:w-[60%] justify-center items-center gap-2 max-w-max'>
              <Button
                className="w-full"
                type="primary"
                onClick={handleSubmitImages}
                disabled={
                  isLoadingData ||
                  !hasModifiedImages
                }
              >
                Submit {modifiedImageCount ? modifiedImageCount : ""} images
              </Button>
              <ImageHandler isLoading={isLoadingData} />
            </div>
          )}
        </div>
        {hasImages && (
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
                  id={fileId}
                  url={img?.url}
                  isModified={img?.isModified || false}
                  onClick={() => {
                    setOpenModal(img.fileId);
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
