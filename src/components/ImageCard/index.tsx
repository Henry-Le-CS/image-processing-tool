import { Card, Image } from 'antd';
import { FC } from 'react';

interface IImageCardProps {
  filename: string;
  url: string;
  id: string;
  onClick: () => void;
  isModified: boolean;
}

const ImageCard: FC<IImageCardProps> = ({
  filename,
  url,
  id,
  onClick,
  isModified,
}) => {
  return (
    <div className="relative">
      {isModified && (
        <div className="absolute t-0 l-0 w-full h-full bg-gray-800 z-[2] opacity-40 rounded-lg pointer-events-none"></div>
      )}
      <Card
        onClick={() => onClick()}
        title={filename + id}
        size="small"
        hoverable
      >
        <Image
          className="w-full"
          src={url}
          preview={false}
          alt="Traffic image"
        />
      </Card>
    </div>
  );
};

export default ImageCard;
