'use client';

import { create } from 'zustand';
import type { StepColorPart } from '../useStepColor/useStepColor';

interface StepShadingPart {
  id: string;
  name: string;
  label: string;
  color: string;
  colorPicked: string;
  shadingColor: string;
  enabled: boolean;
  rotation: number;
  position: number;
  softness: number;
  opacity: number;
}

interface StepShadingState {
  parts: StepShadingPart[];
  syncFromColorParts: (parts: StepColorPart[]) => void;
  setPartColorPicked: (partId: string, colorPicked: string) => void;
  setPartGradient: (partId: string, patch: Partial<Pick<StepShadingPart, 'enabled' | 'rotation' | 'position' | 'softness' | 'opacity'>>) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const withOpacity = (color: string, opacity: number) => `color-mix(in srgb, ${color} ${clamp(opacity, 0, 100)}%, transparent)`;

const buildShadingColor = (part: Pick<StepShadingPart, 'color' | 'colorPicked' | 'enabled' | 'rotation' | 'position' | 'softness' | 'opacity'>) => {
  if (!part.enabled) return part.color;

  const position = clamp(part.position, 0, 100);
  const halfSoftness = clamp(part.softness, 0, 100) / 2;
  const edgeStart = clamp(position - halfSoftness, 0, 100);
  const edgeEnd = clamp(position + halfSoftness, 0, 100);

  const color1 = withOpacity(part.color, part.opacity);
  const color2 = withOpacity(part.colorPicked, part.opacity);

  // 0deg = direction to top: bottom uses `color`, top uses `colorPicked`.
  return `linear-gradient(${part.rotation}deg, ${color1} 0%, ${color1} ${edgeStart}%, ${color2} ${edgeEnd}%, ${color2} 100%)`;
};

const createPart = (part: StepColorPart): StepShadingPart => {
  const basePart: StepShadingPart = {
    id: part.id,
    name: part.name,
    label: part.label,
    color: part.color,
    colorPicked: part.color,
    enabled: true,
    rotation: 0,
    position: 50,
    softness: 35,
    opacity: 100,
    shadingColor: part.color,
  };

  return { ...basePart, shadingColor: buildShadingColor(basePart) };
};

const useStepShading = create<StepShadingState>((set) => ({
  parts: [],
  syncFromColorParts: (colorParts) =>
    set((state) => ({
      parts: colorParts.map((part) => {
        const current = state.parts.find((currentPart) => currentPart.id === part.id);
        const nextPart: StepShadingPart = current ? { ...current, name: part.name, label: part.label, color: part.color } : createPart(part);

        return { ...nextPart, shadingColor: buildShadingColor(nextPart) };
      }),
    })),
  setPartColorPicked: (partId, colorPicked) =>
    set((state) => ({
      parts: state.parts.map((part) => {
        if (part.id !== partId) return part;
        const nextPart = { ...part, colorPicked };
        return { ...nextPart, shadingColor: buildShadingColor(nextPart) };
      }),
    })),
  setPartGradient: (partId, patch) =>
    set((state) => ({
      parts: state.parts.map((part) => {
        if (part.id !== partId) return part;
        const nextPart = { ...part, ...patch };
        return { ...nextPart, shadingColor: buildShadingColor(nextPart) };
      }),
    })),
}));

export { useStepShading };
