import { Geist } from 'next/font/google';

import '@styles';

import { anton, bebasNeue, blackOpsOne, inter, oswald, russoOne } from '@fonts';
import type { ChildrenType } from '@types';

import { cn } from '@utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const RootLayout = ({ children }: ChildrenType) => {
  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        'bg-white',
        inter.variable,
        'font-sans',
        geist.variable,
        oswald.variable,
        bebasNeue.variable,
        anton.variable,
        russoOne.variable,
        blackOpsOne.variable,
      )}
    >
      {children}
    </html>
  );
};

export default RootLayout;
