'use client';

import { memo, useEffect, useMemo } from 'react';

import { buildLogoGizmoElements, buildNameGizmoElements } from '@gizmo';
import { useGizmoButtonHover, useGizmoSelection } from '@hooks';
import { resolveNameLimits, useConfigurationControl, useConfiguratorProduct, useGarmentLogo, useGarmentName } from '@store';
import { resolvePrintAtlasSize } from '@utils';

import { PrintGizmoInstance } from './PrintGizmoInstance';

const NAME_STEP = 4;
const LOGO_STEP = 6;

const PrintGizmoLayer = memo(() => {
  const product = useConfiguratorProduct((state) => state.product);
  const activeStep = useConfigurationControl((state) => state.activeStep);

  const nameInstances = useGarmentName((state) => state.instances);
  const nameSelectedInstanceId = useGarmentName((state) => state.selectedInstanceId);
  const setNameSelectedInstance = useGarmentName((state) => state.setSelectedInstance);
  const clearNameSelectedInstance = useGarmentName((state) => state.clearSelectedInstance);
  const bringNameInstanceToFront = useGarmentName((state) => state.bringInstanceToFront);

  const logoInstances = useGarmentLogo((state) => state.instances);
  const logoSelectedInstanceId = useGarmentLogo((state) => state.selectedInstanceId);
  const setLogoSelectedInstance = useGarmentLogo((state) => state.setSelectedInstance);
  const clearLogoSelectedInstance = useGarmentLogo((state) => state.clearSelectedInstance);
  const bringLogoInstanceToFront = useGarmentLogo((state) => state.bringInstanceToFront);

  const limits = useMemo(() => (product.nameDefaults ? resolveNameLimits(product) : null), [product]);

  const gizmoStep = activeStep === NAME_STEP ? NAME_STEP : activeStep === LOGO_STEP ? LOGO_STEP : null;

  const elements = useMemo(() => {
    if (activeStep === NAME_STEP && limits) {
      return buildNameGizmoElements({ product, instances: nameInstances, fontSizeMin: limits.fontSizeMin, fontSizeMax: limits.fontSizeMax });
    }
    if (activeStep === LOGO_STEP) {
      return buildLogoGizmoElements({ product, instances: logoInstances });
    }
    return [];
  }, [activeStep, limits, logoInstances, nameInstances, product]);

  const selectedInstanceId = activeStep === NAME_STEP ? nameSelectedInstanceId : activeStep === LOGO_STEP ? logoSelectedInstanceId : null;

  const selectionStore = useMemo(
    () =>
      activeStep === LOGO_STEP
        ? {
            selectedInstanceId: logoSelectedInstanceId,
            setSelectedInstance: setLogoSelectedInstance,
            clearSelectedInstance: clearLogoSelectedInstance,
            bringInstanceToFront: bringLogoInstanceToFront,
          }
        : {
            selectedInstanceId: nameSelectedInstanceId,
            setSelectedInstance: setNameSelectedInstance,
            clearSelectedInstance: clearNameSelectedInstance,
            bringInstanceToFront: bringNameInstanceToFront,
          },
    [
      activeStep,
      bringLogoInstanceToFront,
      bringNameInstanceToFront,
      clearLogoSelectedInstance,
      clearNameSelectedInstance,
      logoSelectedInstanceId,
      nameSelectedInstanceId,
      setLogoSelectedInstance,
      setNameSelectedInstance,
    ],
  );

  const atlasSize = useMemo(() => resolvePrintAtlasSize(product), [product]);

  useEffect(() => {
    if (activeStep !== NAME_STEP) clearNameSelectedInstance();
  }, [activeStep, clearNameSelectedInstance]);

  useEffect(() => {
    if (activeStep !== LOGO_STEP) clearLogoSelectedInstance();
  }, [activeStep, clearLogoSelectedInstance]);

  useGizmoSelection({ elements, atlasSize, gizmoStep, store: selectionStore });
  useGizmoButtonHover({ elements, atlasSize, gizmoStep, selectedInstanceId });

  if (elements.length === 0) return null;

  return (
    <group>
      {elements.map((element) => (
        <PrintGizmoInstance key={element.id} element={element} elements={elements} gizmoStep={gizmoStep} selectedInstanceId={selectedInstanceId} />
      ))}
    </group>
  );
});

PrintGizmoLayer.displayName = 'PrintGizmoLayer';

export { PrintGizmoLayer };
