import { Form, FormInstance, Input, Select } from 'antd';
import { FC, Fragment } from 'react';
import { STRINGS } from '@/lib/strings';
import {
  TrafficConditionDetailEnum,
  TrafficConditionKeyAsString,
} from '@/enums';

const conditionList = STRINGS.traffic.condition;

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
            options={conditionList.map((condition) => {
              return {
                value: condition,
                label:
                  TrafficConditionDetailEnum[
                    condition as TrafficConditionKeyAsString
                  ],
              };
            })}
          />
        </Form.Item>
        <Form.Item
          name="density"
          label="Density"
          rules={[
            { required: true },
            () => ({
              validator(_, value) {
                const num = Number(value);
                if (
                  !isNaN(num) &&
                  Number.isInteger(num) &&
                  num >= 0 &&
                  num <= 3
                )
                  return Promise.resolve();
                else
                  return Promise.reject(
                    new Error('Density must be an integer between 0 and 3')
                  );
              },
            }),
          ]}
        >
          <Input placeholder="Select the appropriate traffic density" />
        </Form.Item>
        <Form.Item
          name="velocity"
          label="Velocity (km/h)"
          rules={[
            { required: true },
            () => ({
              validator(_, value) {
                const num = Number(value);
                if (!isNaN(num) && num >= 0 && num <= 120)
                  return Promise.resolve();
                else
                  return Promise.reject(
                    new Error('Velocity must be a number between 0 and 120')
                  );
              },
            }),
          ]}
        >
          <Input placeholder="Select the appropriate traffic velocity" />
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default LabelingForm;
