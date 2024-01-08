import { Image } from 'antd';
import { ImageProps } from 'antd/es/image';
import { FC } from 'react';

interface IImageContainer extends ImageProps {
  url: string;
  className?: string;
}

const ImageContainer: FC<IImageContainer> = ({
  url,
  className,
  ...restProps
}) => {
  let newClassName = 'w-full aspect-square object-contain';
  if (className)
    newClassName = ['w-full aspect-square object-contain', className].join(' ');

  return (
    <Image
      className={newClassName}
      width={'100%'}
      src={url}
      preview={false}
      alt="Traffic image"
      placeholder={
        <div className="flex justify-center ml-4 w-4 h-12">Loading...</div>
      }
      {...restProps}
    />
  );
};

export default ImageContainer;
