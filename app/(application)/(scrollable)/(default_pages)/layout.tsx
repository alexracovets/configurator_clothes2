import { Footer } from '@organisms';
import type { childrenType } from '@types';

const DefaultPagesLayout = ({ children }: childrenType) => {
  return (
    <>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
};

export default DefaultPagesLayout;
