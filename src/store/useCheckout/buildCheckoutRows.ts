import { CHECKOUT_DEFAULT_SIZES } from '@constants';
import type { cartItemConfigurationType, checkoutLineRowType } from '@types';

const createCheckoutRow = (size: string, name = '', number = '', quantity = 1): checkoutLineRowType => ({
  id: crypto.randomUUID(),
  size,
  name,
  number,
  quantity,
});

const buildCheckoutRows = (configuration?: cartItemConfigurationType): checkoutLineRowType[] => {
  const nameInstances = configuration?.name.instances ?? [];
  const numberInstances = configuration?.number.instances ?? [];
  const instanceCount = Math.max(nameInstances.length, numberInstances.length, CHECKOUT_DEFAULT_SIZES.length);

  if (instanceCount === 0) {
    return CHECKOUT_DEFAULT_SIZES.map((size) => createCheckoutRow(size));
  }

  return Array.from({ length: instanceCount }, (_, index) =>
    createCheckoutRow(
      CHECKOUT_DEFAULT_SIZES[index % CHECKOUT_DEFAULT_SIZES.length] ?? 'L',
      nameInstances[index]?.text ?? '',
      numberInstances[index]?.text ?? '',
      1,
    ),
  );
};

export { buildCheckoutRows, createCheckoutRow };
