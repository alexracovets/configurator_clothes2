import { Header } from '@organisms';
import type { childrenType } from '@types';

const FrontEndLayout = async ({ children }: childrenType) => {
  return (
    <body>
      <div className="flex min-h-dvh flex-col">
        <Header />
        {children}
      </div>
    </body>
  );
};

export default FrontEndLayout;
