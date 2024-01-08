'use client';

// import LeafletMap from '@/components/LeafletMap';
import dynamic from 'next/dynamic';

export default function Home() {
  const Map = dynamic(() => import('@/components/LeafletMap'), { ssr: false });
  return (
    <>
      <div>This is the new map view.</div>
      {/* <LeafletMap /> */}
      <Map />
    </>
  );
}
