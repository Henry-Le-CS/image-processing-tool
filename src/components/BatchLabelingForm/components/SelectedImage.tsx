import { Image } from "antd";
import { FC } from "react";
import cx from "clsx"

interface ISelectedImageProps {
    url: string;
    className?: string;
}
const SelectedImage: FC<ISelectedImageProps> = ({ url, className, ...restProps }) => {
    return (
        <Image
            className={cx([
                'w-full aspect-video object-cover',
                className
            ])}
            width={'100%'}
            src={url}
            preview={true}
            alt="Traffic image"
            placeholder={
                <div className="flex justify-center ml-4 w-4 h-12">Loading...</div>
            }
            {...restProps}
        />
    );
}

export default SelectedImage