import { Form, FormInstance, Input, Select } from 'antd';
import { FC, Fragment } from 'react';

interface ILabelingFormProps {
  form: FormInstance;
}

const LabelingForm: FC<ILabelingFormProps> = ({ form }) => {
  return (
    <Fragment>
      <Form form={form} layout="vertical">
        <Form.Item
          name="condition"
          label="Condition"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select the appropriate traffic condition"
            options={[
              { value: 'A', label: 'A - Light' },
              { value: 'B', label: 'B - Normal' },
              { value: 'C', label: 'C - Busy' },
              { value: 'D', label: 'D - Heavy' },
              { value: 'E', label: 'E - Congestion' },
            ]}
          />
        </Form.Item>
        <Form.Item name="density" label="Density" rules={[{ required: true }]}>
          <Input placeholder="Select the appropriate traffic density" />
        </Form.Item>
        <Form.Item
          name="velocity"
          label="Velocity"
          rules={[{ required: true }]}
        >
          <Input placeholder="Select the appropriate traffic velocity" />
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default LabelingForm;
