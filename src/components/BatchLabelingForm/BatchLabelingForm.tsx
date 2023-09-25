import { Form, FormInstance, Input, Select } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { STRINGS } from '@/lib/strings';
import {
    TrafficConditionDetailEnum,
    TrafficConditionEnum,
    TrafficConditionKeyAsString,
} from '@/enums';
import { useAppSelector } from '@/store/store';
import { selectImageList } from '@/store/reducers/imageListReducer';
import { IImageData } from '@/data/types';
import { ImageBatchContainer } from './components';

const conditionList = STRINGS.traffic.condition;
const densityList = STRINGS.traffic.density;

interface IBatchLabelingFormProps {
    form: FormInstance;
    formData?: {
        condition?: TrafficConditionEnum;
        density?: number;
        velocity?: number;
    };
    currentUrlIndex: number;
    setCurrentUrlIndex: Dispatch<SetStateAction<number>>
}

const BatchLabelingForm: FC<IBatchLabelingFormProps> = ({ form, formData, currentUrlIndex, setCurrentUrlIndex }) => {
    useEffect(() => {
        // Set initial form values when formData changes
        form.setFieldsValue(formData);
    }, [formData, form]);

    const images: {
        [key: string]: IImageData;
    } = useAppSelector(selectImageList);

    const selectedImageUrls =
        Object.values(images)
            .filter((img) => img.isSelected)
            .map(img => img.url);

    return (
        <div className="p-4 w-full rounded-md flex flex-col md:flex-row justify-center items-center gap-4">
            <ImageBatchContainer
                currentUrlIndex={currentUrlIndex}
                setCurrentUrlIndex={setCurrentUrlIndex}
                urls={selectedImageUrls}
            />
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
                                        new Error('Velocity must be a number between 0 and 60')
                                    );
                            },
                        }),
                    ]}
                >
                    <Input placeholder="Select the appropriate traffic velocity" />
                </Form.Item>
            </Form>
        </div>
    );
};

export default BatchLabelingForm;
