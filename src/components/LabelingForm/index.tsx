import { Form, FormInstance, Input, Select } from 'antd';
import { FC, Fragment } from 'react';
import { STRINGS } from '@/lib/strings';
import {
  TrafficConditionDetailEnum,
  TrafficConditionEnum,
  TrafficConditionKeyAsString,
} from '@/enums';
import ImageContainer from '../ImageContainer';

const conditionList = STRINGS.traffic.condition;
const densityList = STRINGS.traffic.density;

interface ILabelingFormProps {
  form: FormInstance;
  formData: {
    condition?: TrafficConditionEnum;
    density?: number;
    velocity?: number;
  };
  imageUrl: string;
}

const LabelingForm: FC<ILabelingFormProps> = ({ form, formData, imageUrl }) => {
  // Set initial form values when formData changes
  form.setFieldsValue(formData);

  return (
    <Fragment>
      <div className="p-4 w-full rounded-md flex flex-col md:flex-row justify-center items-center gap-4">
        <div>
          <ImageContainer url={imageUrl} preview={true} />
        </div>
        <Form form={form} layout="vertical" className=" md:min-w-[35%]">
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
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select the appropriate traffic density"
              options={densityList.map((density) => {
                return { value: Number(density), label: density };
              })}
            />
          </Form.Item>
          <Form.Item
            name="velocity"
            label="Velocity (km/h)"
            rules={[
              { required: true },
              () => ({
                validator(_, value) {
                  const num = Number(value);
                  if (!isNaN(num) && num >= 0 && num <= 60)
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
      </div>
    </Fragment>
  );
};

export default LabelingForm;
