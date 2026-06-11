'use client';

import { ViewControls } from './ViewControls';

const CanvasControl = () => {
  return (
    <>
      <ambientLight intensity={1.4} />
      <hemisphereLight args={['#f5f5f5', '#8a8a8a', 0.42]} />
      <directionalLight position={[5, 10, 5]} intensity={0.1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.1} />
      <directionalLight position={[0, -5, 5]} intensity={0.1} />
      <directionalLight position={[-3, 3, 5]} intensity={0.1} />
      <ViewControls />
    </>
  );
};

export { CanvasControl };
