'use client';

import { Fragment, useMemo } from 'react';
import { ClipboardCheck, Home, ShieldCheck, Shirt, Star, Truck } from 'lucide-react';

import { Button } from '@atoms';
import { Badge, Card, CardContent, CardHeader, CardTitle, Separator } from '@shared';

import { getProduct } from '@data';
import { useCheckout } from '@store';
import { getCheckoutDeliveryTimeline, priceFormat } from '@utils';

const TRUST_ITEMS = [
  { icon: Shirt, label: 'Prodotti 100% Made in Italy' },
  { icon: ShieldCheck, label: 'Sicurezza Checkout' },
  { icon: Truck, label: 'Consegna sicura e veloce' },
  { icon: Star, label: 'Recensioni Trustpilot 4,8/5' },
] as const;

const TIMELINE_STEPS = [
  { icon: ClipboardCheck, label: 'Ordine', dateKey: 'order' as const },
  { icon: Truck, label: 'Trasporto', dateKey: 'transport' as const },
  { icon: Home, label: 'Consegnato', dateKey: 'delivered' as const },
];

const CheckoutSummaryPanel = () => {
  const products = useCheckout((state) => state.products);
  const getProductQuantity = useCheckout((state) => state.getProductQuantity);
  const getProductSubtotal = useCheckout((state) => state.getProductSubtotal);
  const getShippingCost = useCheckout((state) => state.getShippingCost);
  const getDiscountPercent = useCheckout((state) => state.getDiscountPercent);
  const getDiscountAmount = useCheckout((state) => state.getDiscountAmount);
  const getGrandTotal = useCheckout((state) => state.getGrandTotal);

  const deliveryTimeline = useMemo(() => getCheckoutDeliveryTimeline(), []);

  const lineItems = useMemo(
    () =>
      products.map((product) => {
        const garment = getProduct(product.styleId, product.productIndex);
        const quantity = getProductQuantity(product.cartItemId);
        const subtotal = getProductSubtotal(product.cartItemId);

        return {
          id: product.cartItemId,
          name: garment?.name ?? 'Prodotto',
          quantity,
          amount: subtotal,
        };
      }),
    [getProductQuantity, getProductSubtotal, products],
  );

  const shippingCost = getShippingCost();
  const discountPercent = getDiscountPercent();
  const discountAmount = getDiscountAmount();
  const grandTotal = getGrandTotal();

  return (
    <Card className="sticky top-6 w-full max-w-[360px] justify-self-end border-0 bg-[#E8E8E8] py-6 ring-0 [--card-spacing:--spacing(6)]">
      <CardHeader className="pb-0">
        <CardTitle className="text-[24px] font-semibold leading-none text-base-black">Riepilogo</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {lineItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="text-[14px] font-medium text-default">{item.name}</span>
                <Badge variant="quantity">{item.quantity} pz</Badge>
              </div>
              <span className="shrink-0 text-[14px] font-medium text-default">{priceFormat(item.amount)}</span>
            </div>
          ))}

          <div className="flex items-center justify-between gap-3">
            <span className="text-[14px] text-default">Spese di spedizione</span>
            <span className="shrink-0 text-[14px] font-medium text-default">{priceFormat(shippingCost)}</span>
          </div>
        </div>

        <Separator className="bg-gray-20" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[16px] font-semibold text-default">Importo Totale:</span>
            <span className="text-[12px] text-gray">IVA 22% inclusa</span>
          </div>
          <span className="text-[24px] font-semibold leading-none text-default">{priceFormat(grandTotal)}</span>
        </div>

        <div className="rounded-[8px] bg-linear-to-r from-[#ECD187] via-[#DC2C6F] to-[#030102] px-4 py-3 text-center text-white">
          <p className="text-[14px] font-semibold leading-snug">% Sconto quantità del {discountPercent}%</p>
          <p className="mt-1 text-[12px] leading-snug">Con questo ordine risparmierai: {priceFormat(discountAmount)}</p>
        </div>

        <Button variant="default" size="sm" className="h-12 w-full rounded-[8px] bg-base-black text-[16px] font-semibold text-white hover:bg-base-black/90">
          Prosegui
        </Button>

        <div className="flex flex-col gap-4">
          <p className="text-[14px] font-semibold text-default">Se ordina ora</p>
          <div className="flex items-start">
            {TIMELINE_STEPS.map((step, index) => {
              const Icon = step.icon;
              const date = deliveryTimeline[step.dateKey];

              return (
                <Fragment key={step.label}>
                  <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
                    <span className="flex size-10 items-center justify-center rounded-full bg-base-black text-white">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="text-[12px] font-medium text-default">{step.label}</span>
                    <span className="text-[12px] text-gray">{date}</span>
                  </div>
                  {index < TIMELINE_STEPS.length - 1 && <Separator className="mt-5 w-full max-w-10 shrink bg-gray-30" />}
                </Fragment>
              );
            })}
          </div>
        </div>

        <Separator className="bg-gray-20" />

        <ul className="flex flex-col gap-3">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-[13px] text-default">
              <Icon className="size-4 shrink-0 stroke-[1.5]" aria-hidden />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export { CheckoutSummaryPanel };
