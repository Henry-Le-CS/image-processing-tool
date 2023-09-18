import { Row, Col, Modal, Form } from 'antd';
import mockData from './mockData.json';
import ImageCard from '../ImageCard';
import { FC, Fragment, useState } from 'react';
import LabelingForm from '../LabelingForm';

const ImageGrid: FC = () => {
  const [openModal, setOpenModal] = useState<number | null>(null);
  const [form] = Form.useForm();

  const handleApplyChanges = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        console.log('Submitted', values);
        setOpenModal(null);
      })
      .catch((err) => {
        console.log('Validation failed', err);
      });
    console.log(form);
  };

  const handleCancelChanges = () => {
    form.resetFields();
    setOpenModal(null);
  };

  return (
    <Fragment>
      <div className="min-w-100 md:min-w-[50%] md:max-w-[80%] min-h-screen md:min-h-[60%] flex justify-center items-center bg-blue-100 rounded-md p-4 md:mt-8">
        <Row
          gutter={[
            { xs: 8, lg: 16 },
            { xs: 16, lg: 16 },
          ]}
        >
          {mockData.data.map((ele, id) => (
            <Col key={id} xs={24} md={6}>
              <ImageCard
                filename={ele.filename}
                id={ele.id}
                url={ele.url}
                onClick={() => {
                  setOpenModal(id);
                }}
              />
            </Col>
          ))}
        </Row>
      </div>
      <Modal
        title={`Rename ${mockData.data[openModal ?? 0].filename}`}
        open={!!openModal}
        onOk={handleApplyChanges}
        onCancel={handleCancelChanges}
      >
        <LabelingForm form={form} />
      </Modal>
    </Fragment>
  );
};

export default ImageGrid;
