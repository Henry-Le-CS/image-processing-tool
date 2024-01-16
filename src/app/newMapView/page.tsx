'use client';

import dynamic from "next/dynamic";

// import LeafletMapPane from '@/components/LeafletMapPane';

export default function Home() {
  const LeafletMapPane = dynamic(() => import('@/components/LeafletMapPane'), {ssr: false})
  return (
    <>
      <LeafletMapPane />
    </>
  );
}
