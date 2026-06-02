/** Mesh UV (print channel / UV1) → canvas pixel (y down, CanvasTexture flipY). */
const uvToCanvas = (uv: { x: number; y: number }, width: number, height: number) => ({
  x: uv.x * width,
  y: (1 - uv.y) * height,
});

export { uvToCanvas };
