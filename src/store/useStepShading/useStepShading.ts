'use client';

import { resolvePartGradientDefaults, resolvePartGradientRotation } from '@constants';

import { create } from 'zustand';
import type { StepColorPart } from '../useStepColor/stepColorTypes';

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
  /** Updates base color for one part (COLOR tab) without rebuilding all shading parts. */
  setPartBaseColor: (partId: string, color: string) => void;
  setPartColorPicked: (partId: string, colorPicked: string) => void;
  setPartGradient: (partId: string, patch: Partial<Pick<StepShadingPart, 'enabled' | 'rotation' | 'position' | 'softness' | 'opacity'>>) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const withOpacity = (color: string, opacity: number) => `color-mix(in srgb, ${color} ${clamp(opacity, 0, 100)}%, transparent)`;

const buildShadingColor = (part: Pick<StepShadingPart, 'id' | 'color' | 'colorPicked' | 'enabled' | 'rotation' | 'position' | 'softness' | 'opacity'>) => {
  if (!part.enabled) return part.color;

  const position = clamp(part.position, 0, 100);
  const halfSoftness = clamp(part.softness, 0, 100) / 2;
  const edgeStart = clamp(position - halfSoftness, 0, 100);
  const edgeEnd = clamp(position + halfSoftness, 0, 100);

  const color1 = withOpacity(part.color, part.opacity);
  const color2 = withOpacity(part.colorPicked, part.opacity);

  const rotation = resolvePartGradientRotation(part.id, part.rotation);
  return `linear-gradient(${rotation}deg, ${color1} 0%, ${color1} ${edgeStart}%, ${color2} ${edgeEnd}%, ${color2} 100%)`;
};

const createPart = (part: StepColorPart): StepShadingPart => {
  const gradientDefaults = resolvePartGradientDefaults(part.id);

  const basePart: StepShadingPart = {
    id: part.id,
    name: part.name,
    label: part.label,
    color: part.color,
    colorPicked: part.color,
    enabled: false,
    ...gradientDefaults,
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
  setPartBaseColor: (partId, color) =>
    set((state) => ({
      parts: state.parts.map((part) => {
        if (part.id !== partId) return part;
        const nextPart = { ...part, color };
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
