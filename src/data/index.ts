import crewneckData from './crewneck/crewneck.json';

import type { GarmentConfig, StyleConfig, StyleId } from './types';

const STYLES: Record<StyleId, StyleConfig> = {
  crewneck: crewneckData as StyleConfig,
};

const getStyle = (id: StyleId): StyleConfig => STYLES[id];

const getProduct = (styleId: StyleId, productIndex: number): GarmentConfig | undefined => STYLES[styleId]?.products[productIndex - 1];

export { getProduct, getStyle, STYLES };
export type { GarmentConfig, StyleConfig, StyleId } from './types';
