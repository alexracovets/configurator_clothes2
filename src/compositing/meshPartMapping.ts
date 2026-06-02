import { UV0_BOUNDS, type Uv0PartKey, type UvBounds } from '@constants';
import type { StepColorPart } from '@store';

const MESH_PART_MATCHERS = [
  { meshToken: 'sleeve_left', partToken: 'sleeve_left' },
  { meshToken: 'sleeve_right', partToken: 'sleeve_right' },
  { meshToken: 'front', partToken: 'front' },
  { meshToken: 'back', partToken: 'back' },
] as const;

const isFabricMeshName = (meshName: string) => {
  const normalized = meshName.toLowerCase();
  if (normalized.includes('label') || normalized.includes('laces')) return false;
  if (normalized.includes('inside')) return false;

  return MESH_PART_MATCHERS.some(({ meshToken }) => normalized.includes(meshToken));
};

const resolveMeshPartId = (meshName: string, parts: StepColorPart[]) => {
  const normalizedMesh = meshName.toLowerCase();

  for (const { meshToken, partToken } of MESH_PART_MATCHERS) {
    if (!normalizedMesh.includes(meshToken)) continue;

    const part = parts.find((item) => item.id.toLowerCase().includes(partToken));
    if (part) return part.id;
  }

  return null;
};

const resolveUv0PartKey = (meshName: string): Uv0PartKey | null => {
  const normalized = meshName.toLowerCase();
  if (normalized.includes('sleeve_left')) return 'sleeve_left';
  if (normalized.includes('sleeve_right')) return 'sleeve_right';
  if (normalized.includes('front')) return 'front';
  if (normalized.includes('back')) return 'back';
  return null;
};

const resolveUv0Bounds = (meshName: string): UvBounds => {
  const key = resolveUv0PartKey(meshName);
  if (!key) return UV0_BOUNDS.full;
  return UV0_BOUNDS[key];
};

export { isFabricMeshName, resolveMeshPartId, resolveUv0Bounds, resolveUv0PartKey };
