type homeProductGalleryItemType = {
  collection: string;
  slug: string;
  alt: string;
};

type homeProductGalleryBlockType = {
  id: string;
  title: string;
  items: homeProductGalleryItemType[];
};

const HOME_PRODUCT_GALLERY_BLOCKS: homeProductGalleryBlockType[] = [
  {
    id: 'home-1.1',
    title: 'COMPLETO GARA CALCIO',
    items: [
      { collection: 'first', slug: 'baggio', alt: 'Baggio' },
      { collection: 'first', slug: 'cruijff', alt: 'Cruijff' },
      { collection: 'first', slug: 'federer', alt: 'Federer' },
      { collection: 'first', slug: 'bernardi', alt: 'Bernardi' },
    ],
  },
  {
    id: 'home-1.2',
    title: 'Completo gara pallavolo',
    items: [
      { collection: 'second', slug: 'bernardi_p', alt: 'Bernardi PallaVolo' },
      { collection: 'second', slug: 'federer_p', alt: 'Federer PallaVolo' },
      { collection: 'second', slug: 'cruijff_p', alt: 'Cruijff PallaVolo' },
      { collection: 'second', slug: 'malone_p', alt: 'Malone PallaVolo' },
      { collection: 'second', slug: 'picci', alt: 'Picci' },
      { collection: 'second', slug: 'sylla_p', alt: 'Sylla PallaVolo' },
      { collection: 'second', slug: 'lollo_p', alt: 'Lollo PallaVolo' },
    ],
  },
  {
    id: 'home-1.3',
    title: 'COMPLETO GARA basket',
    items: [
      { collection: 'third', slug: 'canotta_mb', alt: 'Canotta Basket' },
      { collection: 'third', slug: 'malone_b', alt: 'Malone Basket' },
    ],
  },
  {
    id: 'home-1.4',
    title: 'COMPLETO',
    items: [
      { collection: 'fourd', slug: 'federer_c', alt: 'Federer Completo' },
      { collection: 'fourd', slug: 'cruijff_c', alt: 'Cruijff Completo' },
    ],
  },
];

export type { homeProductGalleryBlockType, homeProductGalleryItemType };
export { HOME_PRODUCT_GALLERY_BLOCKS };
