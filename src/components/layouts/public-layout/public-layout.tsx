import PublicFooter from '@/components/layouts/public-footer';
import PublicHeader from '@/components/layouts/public-header';
import { cn } from '@/lib/utils';
import type { FCC } from '@/types';

type PublicLayoutProps = {
  className?: string;
};

const PublicLayout: FCC<PublicLayoutProps> = ({ children, className }) => {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <PublicHeader />
      <main className={cn('mx-auto w-full flex-1 px-4 py-14 md:px-6', className)}>{children}</main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
