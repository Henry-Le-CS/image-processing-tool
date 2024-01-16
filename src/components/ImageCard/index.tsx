import { Card } from 'antd';
import { FC } from 'react';
import ImageContainer from '../ImageContainer';
import { CardTitle } from './components';

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
        title={<CardTitle fileName={filename} fileId={id} />}
        size="small"
        hoverable
        className="min-w-200"
      >
        <ImageContainer onClick={onClick} url={url} className="max-h-[150px]" />
      </Card>
    </div>
  );
};

export default ImageCard;
