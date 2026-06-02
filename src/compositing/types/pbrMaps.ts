import type { Texture } from 'three';

interface PbrTexturePaths {
  bakeNormal: string;
  bakeAoRoughness: string;
  fabricNormal: string;
  fabricRoughness: string;
}

interface PbrMaps {
  bakeNormal: Texture;
  bakeAoRoughness: Texture;
  fabricNormal: Texture;
  fabricRoughness: Texture;
}

export type { PbrMaps, PbrTexturePaths };
