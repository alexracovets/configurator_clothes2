'use client';

import type { CompositingStoreInput } from './types';
import type { FabricCompositingInput, PrintCompositingInput } from './types/pipelineInputs';

import type { DesignPatternState, PatternCustomization } from '@store';
import { useStepColor, useStepDesign, useStepLogo, useStepName, useStepShading } from '@store';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

const resolveActivePattern = (patterns: DesignPatternState[], activePatternKey: string | null, customizations: Record<string, PatternCustomization>) => {
  if (!activePatternKey) {
    return { pattern: null, customization: null };
  }

  const pattern = patterns.find((item) => item.key === activePatternKey) ?? null;
  const customization = customizations[activePatternKey] ?? null;

  return { pattern, customization };
};

const useFabricCompositingInput = (): FabricCompositingInput => {
  const colorParts = useStepColor((state) => state.parts);
  const shadingParts = useStepShading((state) => state.parts);
  const nameParts = useStepName((state) => state.parts);

  return useMemo(() => ({ colorParts, shadingParts, nameParts }), [colorParts, shadingParts, nameParts]);
};

const usePrintCompositingInput = (): PrintCompositingInput => {
  const { patterns, activePatternKey, customizations, defaultPattern, defaultPatternCustomization } = useStepDesign(
    useShallow((state) => ({
      patterns: state.patterns,
      activePatternKey: state.activePatternKey,
      customizations: state.customizations,
      defaultPattern: state.defaultPattern,
      defaultPatternCustomization: state.defaultPatternCustomization,
    })),
  );
  const logoParts = useStepLogo((state) => state.parts);

  return useMemo(() => {
    const { pattern, customization } = resolveActivePattern(patterns, activePatternKey, customizations);

    return {
      activePattern: pattern,
      activePatternCustomization: customization,
      defaultPattern,
      defaultPatternCustomization,
      logoParts: logoParts.filter((part) => part.visible && !part.isDefault),
    };
  }, [activePatternKey, customizations, defaultPattern, defaultPatternCustomization, logoParts, patterns]);
};

const useCompositingInput = (): CompositingStoreInput => {
  const fabric = useFabricCompositingInput();
  const print = usePrintCompositingInput();

  return useMemo(() => ({ ...fabric, ...print }), [fabric, print]);
};

export { useCompositingInput, useFabricCompositingInput, usePrintCompositingInput };
