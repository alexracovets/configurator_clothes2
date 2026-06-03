const PART_TEXTURE_SIZE = 2048;
const PART_TEXTURE_SIZE_INTERACTIVE = 1024;

const getPartTextureSize = (interactive: boolean) => (interactive ? PART_TEXTURE_SIZE_INTERACTIVE : PART_TEXTURE_SIZE);

export { PART_TEXTURE_SIZE, PART_TEXTURE_SIZE_INTERACTIVE, getPartTextureSize };
