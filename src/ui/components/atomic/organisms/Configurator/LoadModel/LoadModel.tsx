'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import { useGLTF } from '@react-three/drei';

import { STYLES } from '@data';
import { buildModelUrl, deriveModelFileName, useSwitchModel } from '@store';

import { ModelScene } from './ModelScene';

type DisplayState = {
  currentUrl: string;
  outgoingUrl: string | null;
};

const LoadModel = () => {
  const modelPath = useSwitchModel((state) => state.modelPath);
  const modelFileName = useSwitchModel((state) => state.modelFileName);
  const modelUrl = buildModelUrl(modelPath, modelFileName);
  const previousUrlRef = useRef(modelUrl);
  const pendingCompletionRef = useRef(0);

  const [display, setDisplay] = useState<DisplayState>({
    currentUrl: modelUrl,
    outgoingUrl: null,
  });

  useEffect(() => {
    STYLES.crewneck.products.forEach((product) => {
      const fileName = product.modelFile ?? deriveModelFileName(product.path);
      useGLTF.preload(buildModelUrl(product.path, fileName));
    });
  }, []);

  useEffect(() => {
    if (modelUrl === previousUrlRef.current) return;

    const previousUrl = previousUrlRef.current;
    previousUrlRef.current = modelUrl;
    pendingCompletionRef.current = 0;

    setDisplay({
      currentUrl: modelUrl,
      outgoingUrl: previousUrl,
    });
  }, [modelUrl]);

  const handleTransitionComplete = useCallback(() => {
    pendingCompletionRef.current += 1;
    if (pendingCompletionRef.current < 2) return;

    setDisplay((state) => ({
      currentUrl: state.currentUrl,
      outgoingUrl: null,
    }));
  }, []);

  const isTransitioning = display.outgoingUrl !== null;

  return (
    <Suspense fallback={null}>
      {display.outgoingUrl && <ModelScene key={`exit-${display.outgoingUrl}`} url={display.outgoingUrl} phase="exit" onComplete={handleTransitionComplete} />}
      <ModelScene
        key={`${isTransitioning ? 'enter' : 'idle'}-${display.currentUrl}`}
        url={display.currentUrl}
        phase={isTransitioning ? 'enter' : 'idle'}
        onComplete={isTransitioning ? handleTransitionComplete : undefined}
      />
    </Suspense>
  );
};

export { LoadModel };
