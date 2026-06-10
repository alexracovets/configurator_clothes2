'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AtomImage, Flex } from '@atoms';

const Logo = () => {
  const pathname = usePathname();
  const href = pathname === '/configurator' ? '/' : '/configurator';

  return (
    <Flex className="w-full">
      <Link href={href}>
        <AtomImage src="./svg/logo_full.svg" alt="Logo" variant="logo_full" priority />
      </Link>
    </Flex>
  );
};

export { Logo };
