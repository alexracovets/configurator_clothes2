'use client';

import { ViewControls } from './ViewControls';

const CanvasControl = () => {
  return (
    <>
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#f5f5f5', '#8a8a8a', 0.42]} />
      <directionalLight position={[5, 10, 5]} intensity={0.82} />
      <directionalLight position={[-5, 5, -5]} intensity={0.54} />
      <directionalLight position={[0, -5, 5]} intensity={0.3} />
      <directionalLight position={[-3, 3, 5]} intensity={0.36} />
      <ViewControls />
    </>
  );
};

export { CanvasControl };
