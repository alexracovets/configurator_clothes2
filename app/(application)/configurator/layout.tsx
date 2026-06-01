import type { ChildrenType } from '@types';
import { AsideConfiguration, AsideConfigurationUtility, FooterCoinfiguration, HeaderConfiguration } from '@organisms';

const ConfiguratorLayout = ({ children }: ChildrenType) => {
  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] h-full min-h-0 bg-linear-to-t from-[#E8E8E8] to-white">
      <HeaderConfiguration />
      <main className="min-h-0 grid grid-cols-[auto_1fr_auto] h-full">
        <AsideConfiguration />
        {children}
        <AsideConfigurationUtility />
      </main>
      <FooterCoinfiguration />
    </div>
  );
};

export default ConfiguratorLayout;
