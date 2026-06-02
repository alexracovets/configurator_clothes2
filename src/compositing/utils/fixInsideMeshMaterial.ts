import { INSIDE_FABRIC_REPEAT } from '@constants';
import type { Object3D, Texture } from 'three';
import { FrontSide, Mesh, MeshStandardMaterial, NoColorSpace, RepeatWrapping, TangentSpaceNormalMap } from 'three';

const INSIDE_POLYGON_OFFSET = { factor: 1, units: 2 } as const;

const createInsideFabricNormal = (fabricNormal: Texture) => {
  const tex = fabricNormal.clone();
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.repeat.set(INSIDE_FABRIC_REPEAT, INSIDE_FABRIC_REPEAT);
  tex.flipY = false;
  tex.colorSpace = NoColorSpace;
  tex.needsUpdate = true;
  return tex;
};

/** Inside liner: FrontSide + positive polygon offset (configurators/configurator_clothes CrewneckModel). */
const fixInsideMeshMaterial = (root: Object3D, fabricNormal?: Texture) => {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    if (!child.name.toLowerCase().includes('inside')) return;

    const current = Array.isArray(child.material) ? child.material[0] : child.material;
    if (!(current instanceof MeshStandardMaterial)) return;

    const material = current.clone();
    material.side = FrontSide;
    material.polygonOffset = true;
    material.polygonOffsetFactor = INSIDE_POLYGON_OFFSET.factor;
    material.polygonOffsetUnits = INSIDE_POLYGON_OFFSET.units;
    material.roughnessMap = null;
    material.metalnessMap = null;
    material.metalness = 0;
    material.roughness = 0.95;
    material.aoMapIntensity = 1;

    if (material.aoMap) {
      const aoMap = material.aoMap.clone();
      aoMap.flipY = false;
      aoMap.colorSpace = NoColorSpace;
      aoMap.needsUpdate = true;
      material.aoMap = aoMap;
    }

    if (fabricNormal) {
      material.normalMap = createInsideFabricNormal(fabricNormal);
      material.normalMapType = TangentSpaceNormalMap;
      material.normalScale.set(0.4, 0.4);
    }

    material.needsUpdate = true;
    child.material = material;
  });
};

export { fixInsideMeshMaterial };
