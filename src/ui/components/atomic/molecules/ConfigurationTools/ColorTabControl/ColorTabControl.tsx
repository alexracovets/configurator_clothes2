'use client';

import { useState } from 'react';

import { Flex, SvgIcon, Text } from '@atoms';
import { ColorControl } from '@molecules';

import { cn } from '@utils';

interface ColorTabControlProps {
  textColor: string;
  strokeColor: string;
  onTextColor: (color: string) => void;
  onStrokeColor: (color: string) => void;
  label?: string;
}

type ColorTab = 'colori' | 'contorno';

export const COLOR_TABS: { id: ColorTab; label: string }[] = [
  { id: 'colori', label: 'Colori' },
  { id: 'contorno', label: 'Contorno' },
];

const ColorTabControl = ({ textColor, strokeColor, onTextColor, onStrokeColor, label = 'Colore' }: ColorTabControlProps) => {
  const [colorTab, setColorTab] = useState<ColorTab>('colori');

  return (
    <Flex variant="configurator_part">
      <Text variant="configurator_part_label">{label}</Text>
      <div className="flex w-full border-b border-gray-200">
        {COLOR_TABS.map(({ id, label: tabLabel }) => (
          <button
            key={id}
            onClick={() => setColorTab(id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-inter font-medium',
              'border-b-2 -mb-px transition-colors duration-200 cursor-pointer',
              colorTab === id ? 'border-default text-default' : 'border-transparent text-gray hover:text-default',
            )}
          >
            <SvgIcon name={id} />
            {tabLabel}
          </button>
        ))}
      </div>
      {colorTab === 'colori' && <ColorControl color={textColor} onSelect={onTextColor} />}
      {colorTab === 'contorno' && <ColorControl color={strokeColor} onSelect={onStrokeColor} />}
    </Flex>
  );
};

export { ColorTabControl };
