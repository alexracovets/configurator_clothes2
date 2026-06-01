'use client';

import { AtomSelect, Flex, Text } from '@atoms';
import { FONTS_CONFIGURATION } from '@constants';

interface FontSelectRowProps {
  font: string;
  onChange: (font: string) => void;
}

const FontSelectRow = ({ font, onChange }: FontSelectRowProps) => {
  return (
    <Flex variant="configurator_part">
      <Text variant="configurator_part_label">Carattere</Text>
      <AtomSelect
        variant="font"
        options={FONTS_CONFIGURATION.map((f) => ({ label: f.name, value: f.name, fontFamily: f.fontFamily }))}
        value={{ label: font, value: font, fontFamily: font }}
        onChange={({ value }) => onChange(value)}
        icon
      />
    </Flex>
  );
};

export { FontSelectRow };
