import { SiteFooter } from '@/components/landing/site-footer';
import { SiteHeader } from '@/components/landing/site-header';
import { PARTNERS } from '@/mock/landing';
import { SERVICES } from '@/mock/services';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/ecosystem')({ component: Ecosystem });

function Ecosystem() {
  const featured = SERVICES.filter((s) => s.popular);
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <SiteHeader />
      <main className='mx-auto w-full flex-1 max-w-[1100px] px-4 py-14 md:px-6'>
        <h1 className='font-display text-[clamp(34px,3.1vw,46px)] leading-[1.15] font-semibold tracking-[-0.016em]'>Ecosystem</h1>
        <p className='mt-3 max-w-xl text-muted-foreground'>The services, wallets and investors behind Signet.</p>
        <h2 className='mt-12 mb-4 text-sm font-medium'>Featured services</h2>
        <div className='grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3'>
          {featured.map((s) => (
            <div key={s.id} className='bg-background p-5'><b className='font-display text-[22px] font-semibold'>{s.name}</b><p className='mt-2 text-sm text-muted-foreground'>{s.description}</p></div>
          ))}
        </div>
        <Link to='/explore' className='mt-6 inline-block text-[15px] hover:text-muted-foreground'>Browse all services →</Link>
        <h2 className='mt-14 mb-4 text-sm font-medium'>Investors &amp; partners</h2>
        <ul className='flex flex-wrap gap-x-10 gap-y-4 text-[17px] text-[#9ea3ad]'>{PARTNERS.map((p) => <li key={p}>{p}</li>)}</ul>
      </main>
      <SiteFooter />
    </div>
  );
}
