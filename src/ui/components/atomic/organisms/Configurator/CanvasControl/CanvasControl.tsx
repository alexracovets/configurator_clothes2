'use client';

import { Environment } from '@react-three/drei';

import { useConfigurationControl } from '@store';

import { LogoGizmoHandler } from '../../../molecules/LogoGizmoHandler';
import { NameGizmoHandler } from '../../../molecules/NameGizmoHandler';
import { NumberGizmoHandler } from '../../../molecules/NumberGizmoHandler';
import { ViewControls } from './ViewControls';

const CanvasControl = () => {
  const activeStep = useConfigurationControl((state) => state.activeStep);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.68} />
      <directionalLight position={[-5, 5, -5]} intensity={0.46} />
      <directionalLight position={[0, -5, 5]} intensity={0.26} />
      <directionalLight position={[-3, 3, 5]} intensity={0.32} />
      <Environment preset="warehouse" background={false} environmentIntensity={0.19} />
      <ViewControls />
      {activeStep === 4 && <NameGizmoHandler />}
      {activeStep === 5 && <NumberGizmoHandler />}
      {activeStep === 6 && <LogoGizmoHandler />}
    </>
  );
};

export { CanvasControl };
