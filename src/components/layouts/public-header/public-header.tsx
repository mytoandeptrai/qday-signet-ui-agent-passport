import { Link } from '@tanstack/react-router';
import { MenuIcon } from 'lucide-react';
import { SignetLockup } from '@/components/brand/signet-mark';
import { Show } from '@/components/utilities';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import LanguageSwitcher from '@/components/app/language-switcher';
import PublicHeaderMobileMenu from './public-header-mobile-menu';
import PublicHeaderNavLink from './public-header-nav-link';
import { usePublicHeader } from './use-public-header';

type PublicHeaderProps = {
  overlay?: boolean;
};

const PublicHeader = ({ overlay = false }: PublicHeaderProps) => {
  const { t } = useTranslation('public-layout');
  const { navItems, isSignedIn, isMenuOpen, onOpenMenu, onCloseMenu } = usePublicHeader();

  return (
    <>
      <header className={cn('z-20 h-14 w-full md:h-16', overlay ? 'absolute inset-x-0 top-0' : 'relative border-b border-border')}>
        <div className='mx-auto grid h-full max-w-[1280px] grid-cols-[1fr_auto] items-center px-4 md:grid-cols-[1fr_auto_1fr] md:px-10'>
          <SignetLockup />
          <nav aria-label={t('header.main')} className='hidden gap-9 text-sm md:flex'>
            {navItems.map((n) => (
              <PublicHeaderNavLink key={n.label} {...n} className='text-foreground/80 transition-colors hover:text-foreground' />
            ))}
          </nav>
          <div className='flex items-center justify-end gap-4 text-sm'>
            <LanguageSwitcher className='text-foreground/80 hover:text-foreground' />
            <Link
              to={isSignedIn ? ROUTES.OVERVIEW : ROUTES.LOGIN}
              className='hidden text-foreground/80 hover:text-foreground md:inline'
            >
              {isSignedIn ? t('header.dashboard') : t('header.sign-in')}
            </Link>
            <button type='button' aria-label={t('header.menu')} aria-expanded={isMenuOpen} className='md:hidden' onClick={onOpenMenu}>
              <MenuIcon className='size-5' strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>
      <Show when={isMenuOpen}>
        <PublicHeaderMobileMenu navItems={navItems} onClose={onCloseMenu} />
      </Show>
    </>
  );
};

export default PublicHeader;
