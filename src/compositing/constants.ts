const MESH_TEXTURE_SIZE = 512;
const PRINT_ATLAS_WIDTH = 2048;
const PRINT_ATLAS_HEIGHT = Math.round((4900 / 9331) * PRINT_ATLAS_WIDTH);

/** Layer order: 1 lowest → 7 highest. Layers 5–6 reserved for Logo / Name+Number. */
const LAYER_ORDER = {
  BASE_COLOR: 1,
  GRADIENT: 2,
  PBR_MAPS: 3,
  PATTERN: 4,
  LOGO: 5,
  NAME_NUMBER: 6,
  DEFAULT_PATTERN: 7,
} as const;

export { LAYER_ORDER, MESH_TEXTURE_SIZE, PRINT_ATLAS_WIDTH, PRINT_ATLAS_HEIGHT };
