import * as THREE from 'three';

import { PART_TEXTURE_SIZE, UV0_BOUNDS } from '@constants';
import { buildGizmoLayout, hitTestGizmoLayout } from './gizmoLayout';
import type { GizmoItem, GizmoZone } from './gizmoLayout';

export type GizmoPartZone = 'back' | 'front' | 'sleeve_left' | 'sleeve_right';

const zoneFromMeshName = (name: string): GizmoPartZone | null => {
  const n = (name ?? '').toLowerCase();
  if (n.includes('back')) return 'back';
  if (n.includes('front')) return 'front';
  if (n.includes('sleeve_left') || (n.includes('sleeve') && n.includes('left'))) return 'sleeve_left';
  if (n.includes('sleeve_right') || (n.includes('sleeve') && n.includes('right'))) return 'sleeve_right';
  return null;
};

const _ray = new THREE.Raycaster();
const _ndc = new THREE.Vector2();
const _worldNormal = new THREE.Vector3();

let _cachedScene: THREE.Scene | null = null;
let _cachedMeshes: THREE.Mesh[] = [];

const getSceneMeshes = (scene: THREE.Scene): THREE.Mesh[] => {
  if (scene !== _cachedScene) {
    _cachedMeshes = [];
    scene.traverse((o) => {
      if (!(o instanceof THREE.Mesh) || !o.geometry?.attributes?.uv) return;
      if (!zoneFromMeshName(o.name)) return;
      _cachedMeshes.push(o);
    });
    _cachedScene = scene;
  }
  return _cachedMeshes;
};

const frontSurfaceHits = (hits: THREE.Intersection[]): THREE.Intersection[] => {
  if (hits.length === 0) return hits;
  const minDistance = hits[0].distance;
  const epsilon = Math.max(0.002, minDistance * 0.02);
  const out: THREE.Intersection[] = [];
  for (const hit of hits) {
    if (hit.distance > minDistance + epsilon) break;
    if (!hit.face) continue;
    _worldNormal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld).normalize();
    if (_worldNormal.dot(_ray.ray.direction) > 0) continue;
    out.push(hit);
  }
  return out;
};

/** Ray-cast pointer event → hits on fabric meshes. Returns atlas UV + mesh info. */
const getGizmoHits = (
  e: PointerEvent,
  gl: THREE.WebGLRenderer,
  camera: THREE.Camera,
  scene: THREE.Scene,
): Array<{ uv: THREE.Vector2; meshName: string; zone: GizmoPartZone }> => {
  const rect = gl.domElement.getBoundingClientRect();
  _ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, ((e.clientY - rect.top) / rect.height) * -2 + 1);
  _ray.setFromCamera(_ndc, camera);
  const meshes = getSceneMeshes(scene);
  const out: Array<{ uv: THREE.Vector2; meshName: string; zone: GizmoPartZone }> = [];
  for (const hit of frontSurfaceHits(_ray.intersectObjects(meshes, false))) {
    if (!hit.uv) continue;
    const zone = zoneFromMeshName((hit.object as THREE.Mesh).name);
    if (zone) out.push({ uv: hit.uv.clone(), meshName: (hit.object as THREE.Mesh).name, zone });
  }
  return out;
};

/** Normalise atlas UV0 → part-local 0-1 space using UV0_BOUNDS. */
const normaliseUVForZone = (uvX: number, uvY: number, zone: GizmoPartZone): { nx: number; ny: number } => {
  const b = UV0_BOUNDS[zone];
  return {
    nx: (uvX - b.minX) / (b.maxX - b.minX),
    ny: (uvY - b.minY) / (b.maxY - b.minY),
  };
};

/**
 * Generic canvas hit-test for any set of GizmoItems on a part canvas.
 * uvX/uvY are raw atlas UV0 from the raycaster — normalised internally.
 */
const gizmoHitTest = (
  uvX: number,
  uvY: number,
  zone: GizmoPartZone,
  items: GizmoItem[],
  selectedId: string | null,
): { id: string; gizmoZone: GizmoZone } | null => {
  const size = PART_TEXTURE_SIZE;

  const { nx, ny } = normaliseUVForZone(uvX, uvY, zone);
  if (nx < -0.15 || nx > 1.15 || ny < -0.15 || ny > 1.15) return null;

  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    const layout = buildGizmoLayout(item, size);

    if (item.id === selectedId) {
      const gz = hitTestGizmoLayout(item, nx, ny, layout, size);
      if (gz !== null) return { id: item.id, gizmoZone: gz };
    } else {
      const gz = hitTestGizmoLayout(item, nx, ny, layout, size);
      if (gz === 'body') return { id: item.id, gizmoZone: 'body' };
    }
  }

  return null;
};

export { getGizmoHits, gizmoHitTest, normaliseUVForZone, zoneFromMeshName };
