'use client';

import { Box, Button, Flex, Text } from '@atoms';

interface ToggleControlProps {
  label: string;
  active: boolean;
  onChange: (value: boolean) => void;
}

const ToggleControl = ({ label, active, onChange }: ToggleControlProps) => {
  return (
    <Flex className="justify-between items-center w-full">
      <Text variant="configurator_part_label">{label}</Text>
      <Button onClick={() => onChange(!active)} variant="toggle" data-active={active}>
        <Box variant="toggle_handle" data-active={active} />
      </Button>
    </Flex>
  );
};

export { ToggleControl };
