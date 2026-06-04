'use client';

import { useEffect } from 'react';

import { useGarmentNumberPreview, useStepNumber, useStepNumberSelection } from '@store';
import type { StepNumberPartState } from '@store';
import { numberPartToGizmoItem } from '../../../../../compositing/utils/numberGizmoLayout';
import { useTextGizmoHandler } from '../TextGizmoHandler';

const NumberGizmoHandler = () => {
  // Clear selection + preview when the handler unmounts (step change).
  useEffect(
    () => () => {
      useStepNumberSelection.getState().selectPart(null);
      useGarmentNumberPreview.getState().clearNumberPreview();
    },
    [],
  );

  useTextGizmoHandler<StepNumberPartState>({
    getParts: () => useStepNumber.getState().parts,
    getPart: (id) => useStepNumber.getState().parts.find((p) => p.id === id),
    addPart: (part) => useStepNumber.getState().addPart(part),
    removePart: (id) => useStepNumber.getState().removePart(id),
    updatePart: (id, patch) => useStepNumber.getState().updatePart(id, patch),
    getSelectedId: () => useStepNumberSelection.getState().selectedPartId,
    selectPart: (id) => useStepNumberSelection.getState().selectPart(id),
    setPreview: (id, patch) => useGarmentNumberPreview.getState().setNumberPreview(id, patch),
    clearPreview: () => useGarmentNumberPreview.getState().clearNumberPreview(),
    partToGizmoItem: numberPartToGizmoItem,
    makeCopy: (part) => ({
      ...part,
      id: `${part.id}_copy_${Date.now()}`,
      uv: { x: Math.min(0.95, part.uv.x + 0.05), y: Math.min(0.95, part.uv.y + 0.05) },
      isDefault: false,
    }),
  });

  return null;
};

export { NumberGizmoHandler };
