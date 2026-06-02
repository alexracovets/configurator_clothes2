import { PART_TEXTURE_SIZE } from '@constants';

import { MESH_TEXTURE_SIZE, PRINT_ATLAS_HEIGHT, PRINT_ATLAS_WIDTH } from '../constants';

const createLayerCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

const createMeshLayerCanvas = () => createLayerCanvas(MESH_TEXTURE_SIZE, MESH_TEXTURE_SIZE);
const createPrintAtlasCanvas = () => createLayerCanvas(PRINT_ATLAS_WIDTH, PRINT_ATLAS_HEIGHT);
const createPartLayerCanvas = () => createLayerCanvas(PART_TEXTURE_SIZE, PART_TEXTURE_SIZE);

export { createLayerCanvas, createPartLayerCanvas, createMeshLayerCanvas, createPrintAtlasCanvas };
