import { CheckIcon, ChevronsUpDownIcon, CopyIcon, LoaderCircleIcon, LogOutIcon, WalletIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { DEFAULT_NETWORK, NETWORKS } from '@/constant';
import { useCopy } from '@/hooks/use-copy';
import { useTranslation } from '@/integrations/i18n';
import { useWallet } from '@/integrations/wallet';
import { shortAddress } from '@/lib/format';

const buttonClass = 'h-10 gap-3 border border-border px-3 text-body [&_svg]:size-4.5';

const AppSidebarWallet = () => {
  const { t } = useTranslation('wallet');
  const { address, isConnected, status, connect, disconnect } = useWallet();
  const [copied, copy] = useCopy();
  const network = NETWORKS[DEFAULT_NETWORK];

  if (!isConnected || !address) {
    const connecting = status === 'connecting';
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={t('connect.button')}
          disabled={connecting}
          onClick={connect}
          className={`${buttonClass} hover:border-primary/40 hover:bg-primary/5`}
        >
          {connecting ? <LoaderCircleIcon className='animate-spin' /> : <WalletIcon strokeWidth={1.4} />}
          <span>{connecting ? t('connect.connecting') : t('connect.button')}</span>
        </SidebarMenuButton>
        {(status === 'rejected' || status === 'error') && (
          <p role='alert' className='px-3 pt-1 text-small text-destructive group-data-[collapsible=icon]:hidden'>
            {t(`connect.${status}`)}
          </p>
        )}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={shortAddress(address)} className={buttonClass}>
            <WalletIcon strokeWidth={1.4} />
            <span className='font-mono'>{shortAddress(address)}</span>
            <ChevronsUpDownIcon className='ml-auto' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='top' align='start' className='w-56'>
          <DropdownMenuLabel className='font-normal'>
            <p className='text-small text-muted-foreground'>{t('menu.label')}</p>
            <p className='text-small text-muted-foreground'>
              {t('menu.network')}: {network.name} · {network.token.symbol}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              copy(address);
            }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? t('menu.copied') : t('menu.copy')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={disconnect}>
            <LogOutIcon />
            {t('menu.disconnect')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export default AppSidebarWallet;
