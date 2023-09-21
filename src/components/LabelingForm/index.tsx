import { Form, FormInstance, Input, Select } from 'antd';
import { FC, Fragment, useEffect } from 'react';
import { STRINGS } from '@/lib/strings';
import {
  TrafficConditionDetailEnum,
  TrafficConditionEnum,
  TrafficConditionKeyAsString,
} from '@/enums';
import ImageContainer from '../ImageContainer';

const conditionList = STRINGS.traffic.condition;

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
  useEffect(() => {
    // Set initial form values when formData changes
    form.setFieldsValue(formData);
  }, [formData, form]);

  return (
    <Fragment>
      <div className="p-4 rounded-md flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="grow h-full">
          <ImageContainer
            url={imageUrl}
            className=" grow h-full"
            preview={true}
          />
        </div>
        <Form form={form} layout="vertical" className="shrink md:max-w-[40%]">
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
      </div>
    </Fragment>
  );
};

export default LabelingForm;
