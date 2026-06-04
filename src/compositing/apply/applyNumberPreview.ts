import type { Object3D } from 'three';
import { CanvasTexture, ClampToEdgeWrapping, SRGBColorSpace } from 'three';

import type { NumberPreviewPatch } from '@store';
import { useStepNumberSelection } from '@store';
import type { FabricCompositingInput } from '../types/pipelineInputs';
import { getGarmentRuntime } from '../runtime/garmentRuntime';
import { resolveMeshPartId } from '../meshPartMapping';
import { forEachFabricMesh, forEachStandardMaterial } from '../utils/mesh';
import { drawNameOnPart } from '../utils/drawNameOnPart';
import { buildNumberGizmoLayout, drawGizmoFrame, drawGizmoHandle, GIZMO_HANDLES, numberPartToGizmoItem } from '../utils/numberGizmoLayout';
import { PART_TEXTURE_SIZE } from '@constants';

// Own reusable preview canvas + texture — separate from the name preview module global.
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

const resolveZone = (key: string): string | null => {
  const k = key.toLowerCase();
  if (k.includes('back')) return 'back';
  if (k.includes('front')) return 'front';
  if (k.includes('sleeve_left') || k.includes('left')) return 'sleeve_left';
  if (k.includes('sleeve_right') || k.includes('right')) return 'sleeve_right';
  return null;
};

const applyNumberPreview = (root: Object3D, fabric: FabricCompositingInput, partId: string, patch: NumberPreviewPatch): void => {
  const runtime = getGarmentRuntime(root);
  const selectedPartId = useStepNumberSelection.getState().selectedPartId;

  // The part being previewed determines which zone (and thus which color part / mesh) is affected.
  const previewPart = fabric.numberParts.find((p) => p.id === partId);
  if (!previewPart) return;
  const previewZone = previewPart.zone;
  if (!previewZone) return;

  const affectedColorPartIds = fabric.colorParts.filter((p) => resolveZone(p.id) === previewZone).map((p) => p.id);

  for (const colorPartId of affectedColorPartIds) {
    const cached = runtime.fabricByPartId.get(colorPartId);
    if (!cached) continue;

    const size = PART_TEXTURE_SIZE;
    const { canvas, texture } = getPreviewTarget(size);
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(cached.baseCanvas, 0, 0, size, size);

    // Committed names for this zone stay visible underneath (not being edited here).
    for (const namePart of fabric.nameParts) {
      if (resolveZone(namePart.positionKey) !== resolveZone(colorPartId)) continue;
      drawNameOnPart(ctx, namePart, size);
    }

    for (const numberPart of fabric.numberParts) {
      const resolvedPart = numberPart.id === partId ? { ...numberPart, ...patch } : numberPart;
      if (resolvedPart.zone !== resolveZone(colorPartId)) continue;
      drawNameOnPart(ctx, resolvedPart, size);

      if (resolvedPart.id === selectedPartId) {
        const item = numberPartToGizmoItem(resolvedPart);
        const layout = buildNumberGizmoLayout(item, size);
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
        material.userData.numberPreviewActive = true;
        material.needsUpdate = true;
      });
    });
  }
};

const clearNumberPreview = (root: Object3D, fabric: FabricCompositingInput): void => {
  const runtime = getGarmentRuntime(root);

  forEachFabricMesh(root, (mesh) => {
    forEachStandardMaterial(mesh, (material) => {
      if (!material.userData.numberPreviewActive) return;
      material.userData.numberPreviewActive = false;

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

export { applyNumberPreview, clearNumberPreview };
