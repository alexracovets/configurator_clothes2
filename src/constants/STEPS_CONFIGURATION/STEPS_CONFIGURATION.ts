'use client';

import { ConfigurationColorize } from '../../ui/components/atomic/molecules/ConfigurationSteps/ConfigurationColorize';
import { ConfigurationDesign } from '../../ui/components/atomic/molecules/ConfigurationSteps/ConfigurationDesign';
import { ConfigurationLogo } from '../../ui/components/atomic/molecules/ConfigurationSteps/ConfigurationLogo';
import { ConfigurationNaming } from '../../ui/components/atomic/molecules/ConfigurationSteps/ConfigurationNaming';
import { ConfigurationNumbers } from '../../ui/components/atomic/molecules/ConfigurationSteps/ConfigurationNumbers';
import { ConfigurationShading } from '../../ui/components/atomic/molecules/ConfigurationSteps/ConfigurationShading';
import type { HeaderConfigItemType } from '@types';

const STEPS_CONFIGURATION: HeaderConfigItemType[] = [
  { value: 'colore', label: 'Color', content: ConfigurationColorize, step: 1 },
  { value: 'design', label: 'Design', content: ConfigurationDesign, step: 2 },
  { value: 'shading', label: 'Sfumatura', content: ConfigurationShading, step: 3 },
  { value: 'name', label: 'Nome', content: ConfigurationNaming, step: 4 },
  { value: 'number', label: 'Numero', content: ConfigurationNumbers, step: 5 },
  { value: 'logo', label: 'Logo', content: ConfigurationLogo, step: 6 },
];

export { STEPS_CONFIGURATION };
