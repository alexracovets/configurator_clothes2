'use client';

import { useEffect } from 'react';

import { useGarmentNamePreview, useStepName, useStepNameSelection } from '@store';
import type { StepNamePartState } from '@store';
import { namePartToGizmoItem } from '../../../../../compositing/utils/nameGizmoLayout';
import { useTextGizmoHandler } from '../TextGizmoHandler';

const NameGizmoHandler = () => {
  // Clear selection + preview when the handler unmounts (step change).
  useEffect(
    () => () => {
      useStepNameSelection.getState().selectPart(null);
      useGarmentNamePreview.getState().clearNamePreview();
    },
    [],
  );

  useTextGizmoHandler<StepNamePartState>({
    getParts: () => useStepName.getState().parts,
    getPart: (id) => useStepName.getState().parts.find((p) => p.id === id),
    addPart: (part) => useStepName.getState().addPart(part),
    removePart: (id) => useStepName.getState().removePart(id),
    updatePart: (id, patch) => useStepName.getState().updatePart(id, patch),
    getSelectedId: () => useStepNameSelection.getState().selectedPartId,
    selectPart: (id) => useStepNameSelection.getState().selectPart(id),
    setPreview: (id, patch) => useGarmentNamePreview.getState().setNamePreview(id, patch),
    clearPreview: () => useGarmentNamePreview.getState().clearNamePreview(),
    partToGizmoItem: namePartToGizmoItem,
    makeCopy: (part) => ({
      ...part,
      id: `${part.id}_copy_${Date.now()}`,
      uv: { x: Math.min(0.95, part.uv.x + 0.05), y: Math.min(0.95, part.uv.y + 0.05) },
      isDefault: false,
    }),
  });

  return null;
};

export { NameGizmoHandler };
