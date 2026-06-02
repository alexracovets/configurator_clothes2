import { FABRIC_REPEAT } from '@constants';
import type { PbrMaps } from '../types/pbrMaps';
import type { MeshStandardMaterial, Texture } from 'three';
import { DataTexture, FrontSide, NoColorSpace, RepeatWrapping, RGBAFormat, TangentSpaceNormalMap, Vector2 } from 'three';

const createBakeAoTexture = (source: Texture) => {
  const tex = source.clone();
  tex.channel = 1;
  tex.flipY = false;
  tex.colorSpace = NoColorSpace;
  tex.needsUpdate = true;
  return tex;
};

const createFabricMap = (source: Texture) => {
  const tex = source.clone();
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.repeat.set(FABRIC_REPEAT, FABRIC_REPEAT);
  tex.flipY = false;
  tex.colorSpace = NoColorSpace;
  tex.needsUpdate = true;
  return tex;
};

const cloneBakeNormalTexture = (bakeNormal: Texture) => {
  const tex = bakeNormal.clone();
  tex.flipY = false;
  tex.colorSpace = NoColorSpace;
  tex.needsUpdate = true;
  return tex;
};

const createDummyNormal = () => {
  const tex = new DataTexture(new Uint8Array([128, 128, 255, 255]), 1, 1, RGBAFormat);
  tex.needsUpdate = true;
  return tex;
};

const applyPbrMapsLayer = (material: MeshStandardMaterial, maps: PbrMaps) => {
  material.color.set('#ffffff');
  material.metalnessMap = null;
  material.lightMap = null;
  material.emissiveMap = null;
  material.displacementMap = null;
  material.alphaMap = null;
  material.aoMap = createBakeAoTexture(maps.bakeAoRoughness);
  material.aoMapIntensity = 0.58;
  material.roughnessMap = createFabricMap(maps.fabricRoughness);
  material.bumpMap = createFabricMap(maps.fabricRoughness);
  material.bumpScale = 0.006;
  material.roughness = 1;
  material.metalness = 0;
  material.envMapIntensity = 0.28;
  material.normalMap = createDummyNormal();
  material.normalMapType = TangentSpaceNormalMap;
  material.normalScale = new Vector2(0.5, 0.5);
  material.userData.pbrBakeNormal = cloneBakeNormalTexture(maps.bakeNormal);
  material.side = FrontSide;
  material.needsUpdate = true;
};

export { applyPbrMapsLayer };
