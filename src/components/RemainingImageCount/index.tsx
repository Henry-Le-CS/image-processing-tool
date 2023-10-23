import { selectRemainingImageCount } from '@/store/reducers/imageListReducer';
import { useAppSelector } from '@/store/store';

const RemainingImageCount = () => {
  const remainingCount: number = useAppSelector(selectRemainingImageCount);
  return <div>Remaining unlabeled images in folder: {remainingCount}</div>;
};

export default RemainingImageCount;
