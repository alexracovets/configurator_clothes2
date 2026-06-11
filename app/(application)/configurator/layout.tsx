import type { childrenType } from '@types';
import {
  AsideConfiguration,
  AsideConfigurationUtility,
  CartConfigurationSync,
  ConfiguratorInitialLoader,
  FooterConfiguration,
  HeaderConfiguration,
} from '@organisms';

const ConfiguratorLayout = ({ children }: childrenType) => {
  return (
    <div className="relative grid grid-cols-1 grid-rows-[auto_1fr_auto] h-full min-h-0 bg-linear-to-t from-[#E8E8E8] to-white">
      <ConfiguratorInitialLoader />
      <CartConfigurationSync />
      <HeaderConfiguration />
      <main className="min-h-0 grid grid-cols-[auto_1fr_auto] h-full">
        <AsideConfiguration />
        {children}
        <AsideConfigurationUtility />
      </main>
      <FooterConfiguration />
    </div>
  );
};

export default ConfiguratorLayout;
