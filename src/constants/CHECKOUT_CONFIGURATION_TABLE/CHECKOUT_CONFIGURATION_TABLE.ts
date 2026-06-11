import { CHECKOUT_SIZES } from '../CHECKOUT_SIZES';

const CHECKOUT_CONFIGURATION_TABLE_COLUMNS = [
  { id: 'row', header: 'Riga', className: 'w-14' },
  { id: 'size', header: 'Taglia', className: 'w-24' },
  { id: 'name', header: 'Nome', className: '' },
  { id: 'number', header: 'Numero', className: 'w-28' },
  { id: 'quantity', header: 'Quantità', className: 'w-32' },
  { id: 'actions', header: 'Modifica', className: 'w-28' },
] as const;

const CHECKOUT_SIZE_SELECT_OPTIONS = CHECKOUT_SIZES.map((size) => ({ label: size, value: size }));

const CHECKOUT_TABLE_ADD_ROW_LABEL = 'Aggiungi riga';

export { CHECKOUT_CONFIGURATION_TABLE_COLUMNS, CHECKOUT_SIZE_SELECT_OPTIONS, CHECKOUT_TABLE_ADD_ROW_LABEL };
