export { LAYER_ORDER, MESH_TEXTURE_SIZE, PRINT_ATLAS_HEIGHT, PRINT_ATLAS_WIDTH } from './constants';
export { useGarmentLayers } from './hooks/useGarmentLayers';
export { splitFabricMeshMaterials } from './apply/applyLayeredMaterials';
export { fixInsideMeshMaterial } from './utils/fixInsideMeshMaterial';
export { composeMeshTexture } from './pipeline/composeMeshTexture';
export { invalidatePrintAtlasCache } from './pipeline/composePrintAtlas';
export type { CompositingInput, CompositingStoreInput, LayerContext, PrintLayerContext, PbrMaps, PbrTexturePaths } from './types';
