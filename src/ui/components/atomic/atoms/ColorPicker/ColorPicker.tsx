'use client';

import React, { useRef, useState } from 'react';

import { AtomPopover, AtomPopoverContent, AtomPopoverTrigger } from '@atoms';

import { hexToHsva, hsvaToHex, ShadeSlider, Wheel } from '@uiw/react-color';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onPreviewChange?: (color: string) => void;
  trigger: React.ReactElement;
}

const isValidHex = (hex: string) => /^#?[0-9a-fA-F]{3,8}$/.test(hex);

const ColorPicker = ({ color, onChange, onPreviewChange, trigger }: ColorPickerProps) => {
  const safeColor = isValidHex(color) ? color : '#000000';
  const [wheelHsva, setWheelHsva] = useState({ ...hexToHsva(safeColor), v: 100 });
  const [brightness, setBrightness] = useState(hexToHsva(safeColor).v);
  const latestHexRef = useRef(safeColor);

  const emitPreview = (hex: string) => {
    latestHexRef.current = hex;
    onPreviewChange?.(hex);
  };

  const emitCommit = (hex: string) => {
    latestHexRef.current = hex;
    onChange(hex);
  };

  const handleWheelChange = (newColor: { hsva: { h: number; s: number; v: number; a: number } }) => {
    const next = { ...newColor.hsva, v: 100 };
    setWheelHsva(next);
    emitPreview(hsvaToHex({ ...next, v: brightness }));
  };

  const handleShadeChange = (newShade: { v: number }) => {
    setBrightness(newShade.v);
    emitPreview(hsvaToHex({ ...wheelHsva, v: newShade.v }));
  };

  const handlePointerUp = () => {
    emitCommit(latestHexRef.current);
  };

  const liveHsva = { ...wheelHsva, v: brightness };

  return (
    <AtomPopover>
      <AtomPopoverTrigger asChild>{trigger}</AtomPopoverTrigger>
      <AtomPopoverContent variant="color_picker" onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
        <style>
          {`
            .w-color-wheel-fill { width: 25px!important; height: 25px!important; border: 2px solid #fff!important;}
            .w-color-alpha-horizontal div {border-radius: 999px!important;}
            .w-color-interactive {left: 0!important; top: -20%!important;}
          `}
        </style>
        <Wheel color={liveHsva} onChange={handleWheelChange} width={241} height={241} />
        <ShadeSlider hsva={liveHsva} onChange={handleShadeChange} style={{ width: '100%', height: 12 }} />
      </AtomPopoverContent>
    </AtomPopover>
  );
};

export { ColorPicker };
