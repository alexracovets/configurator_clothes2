import type { StepLogoPartState } from '@store';

import { PRINT_ATLAS_HEIGHT, PRINT_ATLAS_WIDTH } from '../constants';
import { type GizmoHandle, type GizmoLayout, type GizmoZone, HANDLE_RADIUS_UV } from './gizmoLayout';
import { resolveLogoDrawSizeFromNatural } from './drawLogoOnAtlas';
import { getCachedNaturalSize } from './logoNaturalSize';
import { uvToCanvas } from './uvCanvas';

// Logos live on the print atlas in raw UV0 space (atlas == UV0, see garmentPartMapFragment).
// No part-local normalisation; coordinates are atlas pixels.
// Logos support move / rotate / resize(scale) / delete — no copy handle.
const LOGO_GIZMO_HANDLES: GizmoHandle[] = ['delete', 'rotate', 'resize'];

const handleRadiusPx = () => Math.round(HANDLE_RADIUS_UV * PRINT_ATLAS_WIDTH);

/** Box + handles for a logo on the atlas, in atlas pixels, rotated by part.rotation. */
const buildLogoGizmoLayout = (part: StepLogoPartState, natural: { w: number; h: number }): GizmoLayout => {
  const atlasW = PRINT_ATLAS_WIDTH;
  const atlasH = PRINT_ATLAS_HEIGHT;
  const hr = handleRadiusPx();

  const { drawWidth, drawHeight } = resolveLogoDrawSizeFromNatural(part, natural.w, natural.h);
  const { x: cx, y: cy } = uvToCanvas(part.uv, atlasW, atlasH);

  const rad = (part.rotation * Math.PI) / 180;
  const cosR = Math.cos(rad);
  const sinR = Math.sin(rad);
  const rot = (lx: number, ly: number) => ({
    x: cx + (lx - cx) * cosR - (ly - cy) * sinR,
    y: cy + (lx - cx) * sinR + (ly - cy) * cosR,
  });

  const textBox = { x: cx - drawWidth / 2, y: cy - drawHeight / 2, w: drawWidth, h: drawHeight };
  const outerLeft = textBox.x - hr;
  const outerRight = textBox.x + textBox.w + hr;
  const outerTop = textBox.y - hr;
  const outerBottom = textBox.y + textBox.h + hr;

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

/** Hit-test a raw UV0 (atlas) coordinate against a logo's gizmo. Returns null if no natural size cached yet. */
const logoGizmoHitTest = (uvX: number, uvY: number, part: StepLogoPartState, selected: boolean): GizmoZone | null => {
  const natural = getCachedNaturalSize(part.src);
  if (!natural) return null;

  const atlasW = PRINT_ATLAS_WIDTH;
  const atlasH = PRINT_ATLAS_HEIGHT;
  const hr = handleRadiusPx();

  const px = uvX * atlasW;
  const py = (1 - uvY) * atlasH;

  if (selected) {
    const layout = buildLogoGizmoLayout(part, natural);
    for (const h of LOGO_GIZMO_HANDLES) {
      const { x: hx, y: hy } = layout.handles[h];
      if (Math.hypot(px - hx, py - hy) <= hr) return h;
    }
  }

  const { drawWidth, drawHeight } = resolveLogoDrawSizeFromNatural(part, natural.w, natural.h);
  const { x: cx, y: cy } = uvToCanvas(part.uv, atlasW, atlasH);
  const rad = (part.rotation * Math.PI) / 180;
  const cosR = Math.cos(-rad);
  const sinR = Math.sin(-rad);
  const dx = px - cx;
  const dy = py - cy;
  const lx = dx * cosR - dy * sinR;
  const ly = dx * sinR + dy * cosR;
  if (Math.abs(lx) <= drawWidth / 2 && Math.abs(ly) <= drawHeight / 2) return 'body';

  return null;
};

export { buildLogoGizmoLayout, logoGizmoHitTest, LOGO_GIZMO_HANDLES };
