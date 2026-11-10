import { SiteFooter } from '@/components/landing/site-footer';
import { SiteHeader } from '@/components/landing/site-header';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/terms')({ component: Page });

function Page() {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <SiteHeader />
      <main className='mx-auto w-full flex-1 max-w-[720px] px-4 py-14 md:px-6'>
        <h1 className='font-display text-[40px] leading-[1.15] font-semibold'>Terms of service</h1>
        <p className='mt-2 text-sm text-text-3'>Sample content for the demo. Last updated 1 January 2026.</p>
        <div className='mt-8 space-y-5 text-[15px] leading-[1.7] text-muted-foreground'>
          <p>Signet is a demo product. Every name, number and partner on this site is sample data, and no real payment is made.</p>
          <p>Replace this page with your legal text before launch.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
