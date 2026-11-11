import { CircleUserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { useAppHeaderAccount } from './use-app-header-account';

const AppHeaderAccount = () => {
  const { t } = useTranslation('layout');
  const { user, onNavigate, onSignOut } = useAppHeaderAccount();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('account.menu')}
        className='grid size-9 place-items-center text-muted-foreground outline-none hover:text-foreground'
      >
        <CircleUserIcon className='size-[18px]' strokeWidth={1.4} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel className='font-normal'>
          <div className='text-body font-medium'>{user?.name}</div>
          <div className='text-caption text-muted-foreground'>{user?.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onNavigate(ROUTES.SETTINGS)}>{t('account.settings')}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onNavigate(ROUTES.DEPOSIT)}>{t('account.deposit')}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onNavigate(ROUTES.VOUCHERS)}>{t('account.vouchers')}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSignOut}>{t('account.sign-out')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppHeaderAccount;
