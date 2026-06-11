import { Footer, Header } from '@organisms';
import type { childrenType } from '@types';

const ScrollableLayout = ({ children }: childrenType) => {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default ScrollableLayout;
