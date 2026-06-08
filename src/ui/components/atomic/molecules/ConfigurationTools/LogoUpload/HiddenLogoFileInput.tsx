'use client';

import { forwardRef } from 'react';

import { LOGO_ACCEPTED_INPUT } from '@utils';

interface HiddenLogoFileInputProps {
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const HiddenLogoFileInput = forwardRef<HTMLInputElement, HiddenLogoFileInputProps>(({ disabled, onChange }, ref) => (
  <input ref={ref} type="file" accept={LOGO_ACCEPTED_INPUT} className="hidden" disabled={disabled} onChange={onChange} />
));

HiddenLogoFileInput.displayName = 'HiddenLogoFileInput';

export { HiddenLogoFileInput };
