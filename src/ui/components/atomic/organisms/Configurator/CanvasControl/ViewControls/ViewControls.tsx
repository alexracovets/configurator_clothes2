'use client';

import { OrbitControls } from '@react-three/drei';

const ViewControls = () => {
  return (
    <OrbitControls
      enablePan={false}
      enableDamping={false}
      makeDefault
      minDistance={0.5}
      maxDistance={0.8}
      maxAzimuthAngle={Math.PI / 2}
      maxPolarAngle={Math.PI / 1.5}
    />
  );
};

export { ViewControls };
