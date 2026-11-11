import { Link } from '@tanstack/react-router';
import { XIcon } from 'lucide-react';
import { SignetLockup } from '@/components/brand/signet-mark';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import PublicHeaderNavLink from './public-header-nav-link';

type PublicHeaderMobileMenuProps = {
  navItems: { label: string; href: string }[];
  onClose: () => void;
};

const PublicHeaderMobileMenu = ({ navItems, onClose }: PublicHeaderMobileMenuProps) => {
  const { t } = useTranslation('public-layout');

  return (
    <div className='fixed inset-0 z-[60] md:hidden'>
      <button type='button' aria-label={t('header.close-menu')} className='absolute inset-0 bg-foreground/15' onClick={onClose} />
      <div
        role='dialog'
        aria-modal='true'
        aria-label={t('header.menu')}
        className='absolute inset-x-0 top-0 border-b bg-white px-4 pb-6 shadow-[0_8px_32px_rgba(27,26,23,.08)]'
      >
        <div className='flex h-14 items-center justify-between'>
          <SignetLockup forceLight />
          <button type='button' aria-label={t('header.close-menu')} onClick={onClose}>
            <XIcon className='size-5' strokeWidth={1.5} />
          </button>
        </div>
        <nav className='mt-2 flex flex-col' aria-label={t('header.main')}>
          {navItems.map((n) => (
            <PublicHeaderNavLink
              key={n.label}
              {...n}
              onClick={onClose}
              className='flex min-h-[52px] items-center border-t text-[17px] last:border-b'
            />
          ))}
        </nav>
        <div className='mt-6 flex gap-2'>
          <Link
            to={ROUTES.LOGIN}
            onClick={onClose}
            className='flex h-11 flex-1 items-center justify-center rounded-full border border-input text-[15px] font-medium'
          >
            {t('header.sign-in')}
          </Link>
          <Link
            to={ROUTES.LOGIN}
            search={{ redirect: ROUTES.OVERVIEW }}
            onClick={onClose}
            className='flex h-11 flex-1 items-center justify-center rounded-full bg-primary text-[15px] font-medium text-primary-foreground shadow-primary transition-all sheen hover:brightness-110'
          >
            {t('header.get-started')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicHeaderMobileMenu;
