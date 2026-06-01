import { Footer } from '@organisms';
import type { ChildrenType } from '@types';

const FrontEndLayout = async ({ children }: ChildrenType) => {
  return (
    <>
      <main className="min-h-0">{children}</main>
      <Footer />
    </>
  );
};

export default FrontEndLayout;
