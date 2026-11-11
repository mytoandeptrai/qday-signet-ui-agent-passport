import { SettingsIcon } from 'lucide-react';
import LanguageSwitcher from '@/components/app/language-switcher';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { CustomLink } from '@/components/ui/custom-link';
import { useTranslation } from '@/integrations/i18n';
import { ROUTES } from '@/constant';
import AppHeaderAccount from './app-header-account';
import AppHeaderBanner from './app-header-banner';
import AppHeaderNotifications from './app-header-notifications';

const AppHeader = () => {
  const { t } = useTranslation('layout');

  return (
    <header className='flex h-16 shrink-0 items-center gap-3 border-b bg-background/60 px-4 md:px-8'>
      <SidebarTrigger className='-ml-1 md:hidden' />
      <AppHeaderBanner />
      <div className='ml-auto flex items-center gap-1'>
        <LanguageSwitcher className='h-9 px-2 text-muted-foreground hover:text-foreground' />
        <AppHeaderNotifications />
        <CustomLink
          to={ROUTES.SETTINGS}
          aria-label={t('account.settings')}
          className='grid size-9 place-items-center p-0 text-muted-foreground hover:text-foreground'
        >
          <SettingsIcon className='size-[18px]' strokeWidth={1.4} />
        </CustomLink>
        <AppHeaderAccount />
      </div>
    </header>
  );
};

export default AppHeader;
