'use client';

import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace, type Texture } from 'three';

// Single horizontal atlas with the four tool icons, in this order. The garment shader samples a cell
// per frame corner so the buttons are painted onto the fabric exactly like the selection frame.
const ICON_ORDER = ['duplicate', 'delete', 'rotate', 'scale'] as const;
const CELL = 128;
const CX = CELL / 2;
// Radius 62 → local-px radius = 62 * (GIZMO_BTN_HALF/CX) = 62*120/64 ≈ 116 local-px.
// The frame corner sits √(80²+80²) ≈ 113 local-px from the button centre, so the disc
// naturally covers the frame corner without any frame suppression needed.
const RADIUS = 62;

const drawCircle = (ctx: CanvasRenderingContext2D, ox: number) => {
  ctx.beginPath();
  ctx.arc(ox + CX, CX, RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
};

const drawDuplicate = (ctx: CanvasRenderingContext2D, ox: number) => {
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 4.5;
  ctx.strokeRect(ox + CX - 22, CX - 8, 22, 22);
  ctx.strokeRect(ox + CX - 6, CX - 24, 22, 22);
};

const drawDelete = (ctx: CanvasRenderingContext2D, ox: number) => {
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(ox + CX - 24, CX - 14);
  ctx.lineTo(ox + CX + 24, CX - 14);
  ctx.stroke();
  ctx.strokeRect(ox + CX - 16, CX - 14, 32, 32);
  ctx.beginPath();
  ctx.moveTo(ox + CX - 8, CX - 14);
  ctx.lineTo(ox + CX - 8, CX - 20);
  ctx.lineTo(ox + CX + 8, CX - 20);
  ctx.lineTo(ox + CX + 8, CX - 14);
  ctx.stroke();
};

const drawRotate = (ctx: CanvasRenderingContext2D, ox: number) => {
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.arc(ox + CX, CX, 20, Math.PI * 0.55, Math.PI * 2.05);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ox + CX + 16, CX - 18);
  ctx.lineTo(ox + CX + 24, CX - 6);
  ctx.lineTo(ox + CX + 10, CX - 3);
  ctx.closePath();
  ctx.fillStyle = '#1a1a1a';
  ctx.fill();
};

const drawScale = (ctx: CanvasRenderingContext2D, ox: number) => {
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(ox + CX - 20, CX - 20);
  ctx.lineTo(ox + CX + 20, CX + 20);
  ctx.moveTo(ox + CX + 8, CX + 20);
  ctx.lineTo(ox + CX + 20, CX + 20);
  ctx.lineTo(ox + CX + 20, CX + 8);
  ctx.moveTo(ox + CX - 8, CX - 20);
  ctx.lineTo(ox + CX - 20, CX - 20);
  ctx.lineTo(ox + CX - 20, CX - 8);
  ctx.stroke();
};

const DRAWERS = { duplicate: drawDuplicate, delete: drawDelete, rotate: drawRotate, scale: drawScale } as const;

const buildGizmoIconAtlas = (): Texture | null => {
  const canvas = document.createElement('canvas');
  canvas.width = CELL * ICON_ORDER.length;
  canvas.height = CELL;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ICON_ORDER.forEach((kind, index) => {
    const ox = index * CELL;
    drawCircle(ctx, ox);
    DRAWERS[kind](ctx, ox);
  });

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

const useGizmoIconAtlas = (): Texture | null => {
  const texture = useMemo(() => (typeof document !== 'undefined' ? buildGizmoIconAtlas() : null), []);

  useEffect(() => () => texture?.dispose(), [texture]);

  return texture;
};

export { useGizmoIconAtlas };
