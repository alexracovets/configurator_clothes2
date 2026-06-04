import type { Object3D } from 'three';
import { CanvasTexture, ClampToEdgeWrapping, SRGBColorSpace } from 'three';

import type { NamePreviewPatch } from '@store';
import { useStepNameSelection } from '@store';
import type { FabricCompositingInput } from '../types/pipelineInputs';
import { getGarmentRuntime } from '../runtime/garmentRuntime';
import { resolveMeshPartId } from '../meshPartMapping';
import { forEachFabricMesh, forEachStandardMaterial } from '../utils/mesh';
import { drawNameOnPart } from '../utils/drawNameOnPart';
import { buildGizmoLayout, drawGizmoFrame, drawGizmoHandle, GIZMO_HANDLES } from '../utils/gizmoLayout';
import { namePartToGizmoItem } from '../utils/nameGizmoLayout';
import { PART_TEXTURE_SIZE } from '@constants';

// Single reusable preview canvas + texture — never recreated, just repainted.
let _previewCanvas: HTMLCanvasElement | null = null;
let _previewTexture: CanvasTexture | null = null;

const getPreviewTarget = (size: number): { canvas: HTMLCanvasElement; texture: CanvasTexture } => {
  if (!_previewCanvas) {
    _previewCanvas = document.createElement('canvas');
    _previewCanvas.width = size;
    _previewCanvas.height = size;
    _previewTexture = new CanvasTexture(_previewCanvas);
    _previewTexture.colorSpace = SRGBColorSpace;
    _previewTexture.flipY = false;
    _previewTexture.wrapS = ClampToEdgeWrapping;
    _previewTexture.wrapT = ClampToEdgeWrapping;
    _previewTexture.anisotropy = 16;
  }
  return { canvas: _previewCanvas, texture: _previewTexture! };
};

const applyNamePreview = (root: Object3D, fabric: FabricCompositingInput, partId: string, patch: NamePreviewPatch): void => {
  const runtime = getGarmentRuntime(root);
  const selectedPartId = useStepNameSelection.getState().selectedPartId;

  const affectedColorPartIds = fabric.colorParts.filter((p) => p.id.toLowerCase().includes('back')).map((p) => p.id);

  for (const colorPartId of affectedColorPartIds) {
    const cached = runtime.fabricByPartId.get(colorPartId);
    if (!cached) continue;

    const size = PART_TEXTURE_SIZE;
    const { canvas, texture } = getPreviewTarget(size);

    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(cached.baseCanvas, 0, 0, size, size);

    for (const namePart of fabric.nameParts) {
      const resolvedPart = namePart.id === partId ? { ...namePart, ...patch } : namePart;
      const zone = resolvedPart.positionKey.toLowerCase().includes('back') ? 'back' : null;
      if (!zone || !colorPartId.toLowerCase().includes(zone)) continue;
      drawNameOnPart(ctx, resolvedPart, size);

      if (resolvedPart.id === selectedPartId) {
        const item = namePartToGizmoItem(resolvedPart);
        const layout = buildGizmoLayout(item, size);
        drawGizmoFrame(ctx, layout.textBox, size, resolvedPart.rotation);
        for (const handle of GIZMO_HANDLES) {
          drawGizmoHandle(ctx, layout.handles[handle], handle, size);
        }
      }
    }

    texture.needsUpdate = true;

    forEachFabricMesh(root, (mesh) => {
      const meshPartId = resolveMeshPartId(mesh.name, fabric.colorParts);
      if (meshPartId !== colorPartId) return;

      forEachStandardMaterial(mesh, (material) => {
        material.map = texture;
        material.userData.namePreviewActive = true;
        material.needsUpdate = true;
      });
    });
  }
};

const clearNamePreview = (root: Object3D, fabric: FabricCompositingInput): void => {
  const runtime = getGarmentRuntime(root);

  forEachFabricMesh(root, (mesh) => {
    forEachStandardMaterial(mesh, (material) => {
      if (!material.userData.namePreviewActive) return;
      material.userData.namePreviewActive = false;

      const partId = resolveMeshPartId(mesh.name, fabric.colorParts);
      if (!partId) return;

      const cached = runtime.fabricByPartId.get(partId);
      if (!cached) return;

      const committedTexture = material.userData.fabricTexture as CanvasTexture | undefined;
      if (committedTexture) {
        material.map = committedTexture;
        material.needsUpdate = true;
      }
    });
  });
};

export { applyNamePreview, clearNamePreview };
