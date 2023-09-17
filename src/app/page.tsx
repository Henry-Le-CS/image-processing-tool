'use client';

import ImageGrid from '@/components/ImageGrid';
import { Button } from 'antd';

export default function Home() {
  return (
    <div className="mb-4 w-full h-full flex flex-col justify-center items-center">
      <ImageGrid></ImageGrid>
      <Button
        type="primary"
        className="bg-current w-full fixed bottom-0 md:w-auto md:block md:relative"
      >
        Submit
      </Button>
    </div>
  );
}
