'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

import { LOGO_ACCEPTED_INPUT } from '@utils';

type HiddenLogoFileInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

const HiddenLogoFileInput = forwardRef<HTMLInputElement, HiddenLogoFileInputProps>(({ className, ...props }, ref) => (
  <div className="hidden" aria-hidden>
    <input ref={ref} type="file" accept={LOGO_ACCEPTED_INPUT} tabIndex={-1} className={className} {...props} />
  </div>
));

HiddenLogoFileInput.displayName = 'HiddenLogoFileInput';

export { HiddenLogoFileInput };
