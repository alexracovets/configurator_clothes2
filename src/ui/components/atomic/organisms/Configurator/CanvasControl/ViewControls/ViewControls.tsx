'use client';

import { OrbitControls } from '@react-three/drei';

const ViewControls = () => {
  return <OrbitControls enablePan={false} enableDamping={false} makeDefault />;
};

export { ViewControls };
