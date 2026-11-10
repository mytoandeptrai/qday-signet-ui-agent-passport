import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

export function SignetMark({ className }: { className?: string }) {
  return (
    <svg viewBox='0 0 28 28' className={cn('size-[21px]', className)} aria-hidden='true'>
      <circle cx='14' cy='14' r='11.5' fill='none' stroke='currentColor' strokeWidth='1.5' />
      <path d='M14 7.5 20.5 14 14 20.5 7.5 14Z' fill='currentColor' />
    </svg>
  );
}

export function SignetLockup({ className }: { className?: string }) {
  return (
    <Link to='/' aria-label='Signet, home' className={cn('inline-flex items-center gap-[9px] text-base font-medium tracking-tight', className)}>
      <SignetMark />
      Signet
    </Link>
  );
}
