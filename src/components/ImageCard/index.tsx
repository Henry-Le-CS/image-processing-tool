import { Card, Image } from 'antd';
import { FC } from 'react';

interface IImageCardProps {
  filename: string;
  url: string;
  id: string;
  onClick: () => void;
}

const ImageCard: FC<IImageCardProps> = ({ filename, url, id, onClick }) => {
  return (
    <Card onClick={() => onClick()} title={filename + id} size="small">
      <Image className="w-full" src={url} preview={false} alt="Traffic image" />
    </Card>
  );
};

export default ImageCard;
