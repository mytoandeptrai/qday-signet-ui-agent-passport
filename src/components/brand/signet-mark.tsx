import onDark from '@/assets/lockup-blue-on-dark.svg';
import onLight from '@/assets/lockup-blue.svg';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

/** The Signet app icon, from /public/icon-blue.svg. */
export function SignetMark({ className }: { className?: string }) {
  return <img src='/icon-blue.svg' alt='' aria-hidden='true' className={cn('block size-6', className)} />;
}

/**
 * Horizontal lockup. Both colour variants render and CSS picks one from the `.dark` class,
 * so a theme change needs no JS. `forceLight` is for surfaces that ignore the theme.
 */
export function SignetLockup({ className, forceLight = false, linked = true }: { className?: string; forceLight?: boolean; linked?: boolean }) {
  const logo = (
    <>
      <img src={onLight} alt='Signet' className={cn('h-8 w-auto', !forceLight && 'dark:hidden', className)} />
      {!forceLight && <img src={onDark} alt='' aria-hidden='true' className={cn('hidden h-8 w-auto dark:block', className)} />}
    </>
  );
  return linked ? <Link to='/' aria-label='Signet, home' className='inline-flex'>{logo}</Link> : logo;
}
