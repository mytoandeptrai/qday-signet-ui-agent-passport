import { Outlet } from '@tanstack/react-router';
import PublicFooter from '@/components/layouts/public-footer';
import ScrollToTop from '@/components/ui/scroll-to-top';
import PublicHeader from '@/components/layouts/public-header';
import type { FCC } from '@/types';

type PublicLayoutProps = {};

const PublicLayout: FCC<PublicLayoutProps> = () => {
  return (
    <div className='flex min-h-screen flex-col'>
      <PublicHeader />
      <main className='mx-auto w-full flex-1 px-4 py-14 md:px-6'>
        <Outlet />
      </main>
      <PublicFooter />
      <ScrollToTop />
    </div>
  );
};

export default PublicLayout;
