import { SignetLockup } from '@/components/brand/signet-mark';
import { cn } from '@/lib/utils';
import { usePassportStore } from '@/stores/passport-store';
import { Link } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV = [
  { label: 'How it works', href: '/#how' },
  { label: 'Explore', href: '/explore' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Developers', href: '#' },
];

function NavLink({ href, label, className, onClick }: { href: string; label: string; className?: string; onClick?: () => void }) {
  if (href.startsWith('/#')) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {label}
      </a>
    );
  }
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className} onClick={onClick}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {label}
    </a>
  );
}

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const signedIn = usePassportStore((s) => Boolean(s.user));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header className={cn('z-20 h-14 w-full md:h-16', overlay ? 'absolute inset-x-0 top-0' : 'relative border-b border-border')}>
        <div className='mx-auto grid h-full max-w-[1280px] grid-cols-[1fr_auto] items-center px-4 md:grid-cols-[1fr_auto_1fr] md:px-10'>
          <SignetLockup forceLight />
          <nav aria-label='Main' className='hidden gap-9 text-sm md:flex'>
            {NAV.map((n) => (
              <NavLink key={n.label} {...n} className='text-[#2e3239] transition-colors hover:text-foreground' />
            ))}
          </nav>
          <div className='flex items-center justify-end gap-4 text-sm'>
            <Link to={signedIn ? '/overview' : '/login'} className='hidden text-[#2e3239] hover:text-foreground md:inline'>
              {signedIn ? 'Dashboard' : 'Sign in'}
            </Link>
            <button type='button' aria-label='Menu' aria-expanded={open} className='md:hidden' onClick={() => setOpen(true)}>
              <Menu className='size-5' strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className='fixed inset-0 z-[60] md:hidden'>
          <button type='button' aria-label='Close menu' className='absolute inset-0 bg-foreground/15' onClick={() => setOpen(false)} />
          <div role='dialog' aria-modal='true' aria-label='Menu' className='absolute inset-x-0 top-0 border-b bg-white px-4 pb-6 shadow-[0_8px_32px_rgba(27,26,23,.08)]'>
            <div className='flex h-14 items-center justify-between'>
              <SignetLockup forceLight />
              <button type='button' aria-label='Close menu' onClick={() => setOpen(false)}>
                <X className='size-5' strokeWidth={1.5} />
              </button>
            </div>
            <nav className='mt-2 flex flex-col' aria-label='Main'>
              {NAV.map((n) => (
                <NavLink key={n.label} {...n} onClick={() => setOpen(false)} className='flex min-h-[52px] items-center border-t text-[17px] last:border-b' />
              ))}
            </nav>
            <div className='mt-6 flex gap-2'>
              <Link to='/login' onClick={() => setOpen(false)} className='flex h-11 flex-1 items-center justify-center rounded-full border border-input text-[15px] font-medium'>
                Sign in
              </Link>
              <Link to='/login' search={{ redirect: '/overview' }} onClick={() => setOpen(false)} className='flex h-11 flex-1 items-center justify-center text-[15px] font-medium rounded-full bg-primary sheen text-primary-foreground shadow-primary transition-all hover:brightness-110'>
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
