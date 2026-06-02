const UV0_BOUNDS = {
  back: { minX: 0.0038, maxX: 0.4985, minY: 0.0013, maxY: 0.7299 },
  front: { minX: 0.5028, maxX: 0.9979, minY: 0.0872, maxY: 0.8119 },
  sleeve_left: { minX: 0.0026, maxX: 0.2625, minY: 0.7191, maxY: 0.9967 },
  sleeve_right: { minX: 0.3125, maxX: 0.5711, minY: 0.7182, maxY: 0.998 },
  full: { minX: 0, maxX: 1, minY: 0, maxY: 1 },
} as const;

type Uv0PartKey = keyof typeof UV0_BOUNDS;
type UvBounds = { minX: number; maxX: number; minY: number; maxY: number };

export { UV0_BOUNDS };
export type { Uv0PartKey, UvBounds };
