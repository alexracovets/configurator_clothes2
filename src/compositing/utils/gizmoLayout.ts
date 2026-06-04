import { measureNameGlyph } from './nameTextMetrics';

const HANDLE_RADIUS_UV = 22 / 2048;
/** Extra space between glyph edge and dashed frame (editor px at 2048). */
const GIZMO_FRAME_GAP = 10 / 2048;
const GIZMO_EDITOR_SIZE = 2048;

export type GizmoHandle = 'copy' | 'delete' | 'rotate' | 'resize';
export type GizmoZone = GizmoHandle | 'body' | null;

export interface GizmoLayout {
  textBox: { x: number; y: number; w: number; h: number };
  handles: Record<GizmoHandle, { x: number; y: number }>;
}

export interface GizmoItem {
  id: string;
  uvX: number;
  uvY: number;
  rotation: number;
  text: string;
  font: string;
  fontSize: number;
  strokeWidth?: number;
  mirrorX?: boolean;
}

const GIZMO_HANDLES: GizmoHandle[] = ['copy', 'delete', 'rotate', 'resize'];

/** Half-size of drawn glyph in part-canvas pixels — matches drawNameOnPart. */
const getGlyphHalfExtents = (item: GizmoItem): { halfW: number; halfH: number } => {
  const layout = measureNameGlyph(item.text || 'NAME', item.font, item.fontSize, item.strokeWidth ?? 0);
  if (!layout) {
    const fontSize = Math.round(item.fontSize * 2);
    return { halfW: 50, halfH: fontSize * 0.45 };
  }
  return { halfW: layout.displayHalfW, halfH: layout.displayHalfH };
};

const buildGizmoLayout = (item: GizmoItem, canvasSize: number): GizmoLayout => {
  const hr = Math.round(HANDLE_RADIUS_UV * canvasSize);
  const glyphPad = Math.round(GIZMO_FRAME_GAP * canvasSize);
  const { halfW, halfH } = getGlyphHalfExtents(item);

  const cx = item.uvX * canvasSize;
  const cy = (1 - item.uvY) * canvasSize;

  const rad = (item.rotation * Math.PI) / 180;
  const cosR = Math.cos(rad);
  const sinR = Math.sin(rad);

  const frameHalfW = halfW + glyphPad;
  const frameHalfH = halfH + glyphPad;
  const minBoxSize = 4 * hr;
  const boxW = Math.max(2 * frameHalfW, minBoxSize);
  const boxH = Math.max(2 * frameHalfH, minBoxSize);
  const textBox = { x: cx - boxW / 2, y: cy - boxH / 2, w: boxW, h: boxH };

  const rot = (lx: number, ly: number) => ({
    x: cx + (lx - cx) * cosR - (ly - cy) * sinR,
    y: cy + (lx - cx) * sinR + (ly - cy) * cosR,
  });

  const outerLeft = textBox.x - hr;
  const outerRight = textBox.x + textBox.w + hr;
  const outerTop = item.mirrorX ? textBox.y + textBox.h + hr : textBox.y - hr;
  const outerBottom = item.mirrorX ? textBox.y - hr : textBox.y + textBox.h + hr;

  return {
    textBox,
    handles: {
      delete: rot(outerLeft, outerTop),
      resize: rot(outerRight, outerTop),
      copy: rot(outerLeft, outerBottom),
      rotate: rot(outerRight, outerBottom),
    },
  };
};

const hitTestGizmoLayout = (item: GizmoItem, nx: number, ny: number, layout: GizmoLayout, canvasSize: number): GizmoZone => {
  const px = nx * canvasSize;
  const py = ny * canvasSize;
  const hr = Math.round(HANDLE_RADIUS_UV * canvasSize);
  for (const h of GIZMO_HANDLES) {
    const { x: hx, y: hy } = layout.handles[h];
    if (Math.hypot(px - hx, py - hy) <= hr) return h;
  }

  const cx = item.uvX * canvasSize;
  const cy = (1 - item.uvY) * canvasSize;
  const rad = (item.rotation * Math.PI) / 180;
  const cosR = Math.cos(-rad);
  const sinR = Math.sin(-rad);
  const dx = px - cx;
  const dy = py - cy;
  const lx = dx * cosR - dy * sinR;
  const ly = dx * sinR + dy * cosR;
  const { halfW, halfH } = getGlyphHalfExtents(item);
  if (Math.abs(lx) <= halfW && Math.abs(ly) <= halfH) return 'body';

  return null;
};

const drawGizmoFrame = (ctx: CanvasRenderingContext2D, box: GizmoLayout['textBox'], canvasSize: number, rotationDeg = 0) => {
  const scale = canvasSize / GIZMO_EDITOR_SIZE;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.setLineDash([Math.round(14 * scale), Math.round(8 * scale)]);
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.lineWidth = Math.max(1, Math.round(4 * scale));
  ctx.strokeRect(-box.w / 2, -box.h / 2, box.w, box.h);
  ctx.restore();
};

const drawGizmoHandle = (ctx: CanvasRenderingContext2D, pos: { x: number; y: number }, kind: GizmoHandle, canvasSize: number) => {
  const r = Math.round(HANDLE_RADIUS_UV * canvasSize);
  const s = Math.round((8 * canvasSize) / GIZMO_EDITOR_SIZE);
  ctx.save();
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = Math.max(1, (1.5 * canvasSize) / GIZMO_EDITOR_SIZE);
  ctx.stroke();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(-Math.PI / 2);
  ctx.strokeStyle = kind === 'delete' ? '#ef4444' : '#374151';
  ctx.lineWidth = Math.max(1, (2 * canvasSize) / GIZMO_EDITOR_SIZE);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  switch (kind) {
    case 'copy':
      ctx.strokeRect(-s * 0.3, -s * 0.3, s * 0.85, s * 0.85);
      ctx.strokeRect(-s * 0.85, -s * 0.85, s * 0.85, s * 0.85);
      break;
    case 'delete':
      ctx.beginPath();
      ctx.moveTo(-s, -s * 0.5);
      ctx.lineTo(s, -s * 0.5);
      ctx.stroke();
      ctx.strokeRect(-s * 0.65, -s * 0.15, s * 1.3, s * 0.95);
      break;
    case 'rotate':
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.55, 0.4, Math.PI * 1.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.45, -s * 0.55);
      ctx.lineTo(s * 0.75, -s * 0.2);
      ctx.lineTo(s * 0.35, -s * 0.35);
      ctx.stroke();
      break;
    case 'resize':
      ctx.beginPath();
      ctx.moveTo(-s, s);
      ctx.lineTo(s, -s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.2, -s);
      ctx.lineTo(s, -s);
      ctx.lineTo(s, -s * 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-s, -s * 0.2);
      ctx.lineTo(-s, s);
      ctx.lineTo(-s * 0.2, s);
      ctx.stroke();
      break;
  }
  ctx.restore();
};

export { buildGizmoLayout, hitTestGizmoLayout, getGlyphHalfExtents, drawGizmoFrame, drawGizmoHandle, GIZMO_HANDLES, HANDLE_RADIUS_UV };
