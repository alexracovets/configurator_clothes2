import { Footer } from '@organisms';
import type { childrenType } from '@types';

const FrontEndLayout = async ({ children }: childrenType) => {
  return (
    <>
      <main className="min-h-0">{children}</main>
      <Footer />
    </>
  );
};

export default FrontEndLayout;
