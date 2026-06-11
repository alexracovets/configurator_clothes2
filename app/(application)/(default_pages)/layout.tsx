import { Footer } from '@organisms';
import type { childrenType } from '@types';

const FrontEndLayout = async ({ children }: childrenType) => {
  return (
    <>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
};

export default FrontEndLayout;
