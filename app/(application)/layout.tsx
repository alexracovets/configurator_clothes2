import { Header } from '@organisms';
import type { childrenType } from '@types';

const FrontEndLayout = async ({ children }: childrenType) => {
  return (
    <body className="h-full">
      <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] h-full min-h-dvh">
        <Header />
        {children}
      </div>
    </body>
  );
};

export default FrontEndLayout;
