import { BellIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Show } from '@/components/utilities';
import { useTranslation } from '@/integrations/i18n';
import { timeAgo } from '@/lib/format';
import { useAppHeaderNotifications } from './use-app-header-notifications';

const AppHeaderNotifications = () => {
  const { t } = useTranslation('layout');
  const { notifications, hasPending, onSelect } = useAppHeaderNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('notifications.title')}
        className='relative grid size-9 place-items-center text-muted-foreground outline-none hover:text-foreground'
      >
        <BellIcon className='size-4.5' strokeWidth={1.4} />
        <Show when={hasPending}>
          <span className='absolute top-2 right-2 size-2 rounded-full bg-brand' />
        </Show>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel>{t('notifications.title')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Show when={notifications.length === 0}>
          <div className='px-2 py-6 text-center text-body text-muted-foreground'>{t('notifications.empty')}</div>
        </Show>
        {notifications.map((n) => (
          <DropdownMenuItem key={n.id} onSelect={() => onSelect(n.to)} className='flex-col items-start gap-0.5'>
            <span className='text-body'>{n.text}</span>
            <span className='text-caption text-text-3'>{timeAgo(n.at)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppHeaderNotifications;
