import { FC, useEffect, useState } from 'react';
import { Select } from 'antd';
import { ICameraPaneAutocompleteProps } from './interface';
import { fetchListCamera } from '@/apis/camera';

const Autocomplete: FC<ICameraPaneAutocompleteProps> = ({ parentDisable, onSelect }) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [options, setOptions] = useState<Array<{ value: string, label: string }>>([]);

    const fetchOptions = async () => {
        fetchListCamera(1000, 1).then((res) => {
            const data = res.cameraList;
            const options = data.map((item) => ({
                value: item.camera_id,
                label: item.address
            }));
            setOptions(options);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        setIsLoading(true);
        fetchOptions();
    }, []);

    const filterOptions = (input: string) => {
        return options.filter(option =>
            option.value.toLowerCase().includes(input.toLowerCase()) ||
            option.label.toLowerCase().includes(input.toLowerCase())
        );
    };

    return (
        <Select
            className='min-w-[160px]'
            showSearch
            onSearch={(value) => setInputValue(value)}
            onSelect={(value) => onSelect(value)}
            filterOption={false} // Disable default filtering
            disabled={isLoading || parentDisable}
            loading={isLoading}
            placeholder="Street name"
        >
            {filterOptions(inputValue).map((option) => (
                <Select.Option key={option.value} value={option.value}>
                    {option.label}
                </Select.Option>
            ))}
        </Select>
    );
};

export default Autocomplete;
