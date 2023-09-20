import { Row, Col, Modal, Form, Button } from 'antd';
import mockData from './mockData.json';
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

const ImageGrid: FC = () => {
  const [openModal, setOpenModal] = useState<number | null>(null);
  const [form] = Form.useForm();

  // TODO: Implement async api call here + dispatching the initial state
  const images = useAppSelector(selectImageList);
  const dispatchImgAction = useAppDispatch();

  const handleApplyChanges = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        console.log('Submitted', openModal, values);
        dispatchImgAction(
          updateOne({
            id: openModal ?? 0,
            data: {
              condition: values.condition,
              density: Number(values.density),
              velocity: Number(values.velocity),
            },
          })
        );
        setOpenModal(null);
      })
      .catch((err) => {
        console.log('Validation failed', err);
      });
    console.log(form);
  };

  // TODO: spagetti code at 2 am...
  const handleCancelChanges = () => {
    if (openModal && images[openModal].isModified) {
      if (confirm(STRINGS.confirm.cancel)) {
        form.resetFields();
        dispatchImgAction(resetOne(openModal));
        setOpenModal(null);
      }
      return;
    }
    form.resetFields();
    setOpenModal(null);
  };

  // TODO: Logic to prevent too many refreshes
  const handleGenerateImgs = async () => {
    const prm = new Promise<IImageData[]>((resolve) => {
      setTimeout(() => resolve(mockData.data), 2000);
    });
    const response = await prm;
    console.log(response);
    dispatchImgAction(setAll({ data: response }));
  };

  return (
    <Fragment>
      <div className="min-w-100 md:min-w-[50%] md:max-w-[80%] min-h-screen md:min-h-[60%] flex flex-col justify-center items-center bg-blue-100 rounded-md p-4 md:mt-8 gap-4">
        <div className="">
          <Button block type="primary" onClick={handleGenerateImgs}>
            Generate Images
          </Button>
        </div>
        {images.length > 0 && (
          <Row
            gutter={[
              { xs: 8, lg: 16 },
              { xs: 16, lg: 16 },
            ]}
          >
            {images.map((img: IImageData, id: number) => (
              <Col key={id} xs={24} md={6}>
                <ImageCard
                  filename={img.metadata.name}
                  id={''}
                  url={img.url}
                  isModified={img.isModified}
                  // isModified={true}
                  onClick={() => {
                                        setOpenModal(id);
                  }}
                />
              </Col>
            ))}
          </Row>
        )}
        {images.filter((i) => i.isModified).length > 0 && (
          <Button
            type="primary"
            className="bg-current w-full fixed bottom-0 md:w-auto md:block md:relative"
          >
            Submit
          </Button>
        )}
      </div>
      <Modal
        title={`Rename image`}
        open={typeof openModal === 'number'}
        onOk={handleApplyChanges}
        onCancel={handleCancelChanges}
      >
        <LabelingForm form={form} />
      </Modal>
    </Fragment>
  );
};

export default ImageGrid;
