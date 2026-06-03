import type { Object3D } from 'three';
import { Color } from 'three';

import type { StepColorPart } from '@store';
import { resolveMeshPartId } from '../meshPartMapping';
import { forEachFabricMesh, forEachStandardMaterial } from '../utils/mesh';

/** Instant COLOR preview — GPU tint only, no canvas compositing. */
const applyPartColorPreview = (root: Object3D, colorParts: StepColorPart[], partId: string, hex: string) => {
  const tint = new Color(hex);

  forEachFabricMesh(root, (mesh) => {
    if (resolveMeshPartId(mesh.name, colorParts) !== partId) return;

    forEachStandardMaterial(mesh, (material) => {
      material.color.copy(tint);
      material.userData.colorPreviewActive = true;
      material.needsUpdate = true;
    });
  });
};

const clearAllColorPreviews = (root: Object3D) => {
  const neutral = new Color('#ffffff');

  forEachFabricMesh(root, (mesh) => {
    forEachStandardMaterial(mesh, (material) => {
      if (!material.userData.colorPreviewActive) return;
      material.color.copy(neutral);
      material.userData.colorPreviewActive = false;
      material.needsUpdate = true;
    });
  });
};

export { applyPartColorPreview, clearAllColorPreviews };
