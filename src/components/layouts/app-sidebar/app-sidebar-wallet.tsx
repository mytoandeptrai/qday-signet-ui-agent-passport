import { CheckIcon, ChevronsUpDownIcon, CopyIcon, LoaderCircleIcon, LogOutIcon, WalletIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NETWORKS, type NetworkKey } from '@/constant';
import { useCopy } from '@/hooks/use-copy';
import { useTranslation } from '@/integrations/i18n';
import { useActiveNetwork, useWallet } from '@/integrations/wallet';
import { shortAddress } from '@/lib/format';

const buttonClass = 'h-10 gap-3 border border-border px-3 text-body [&_svg]:size-4.5';

const AppSidebarWallet = () => {
  const { t } = useTranslation('wallet');
  const { address, isConnected, status, connect, disconnect } = useWallet();
  const { network, isUnsupported, switchingTo, switchNetwork } = useActiveNetwork();
  const [copied, copy] = useCopy();

  if (!isConnected || !address) {
    const isBusy = status !== 'idle';
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={t('connect.button')}
          disabled={isBusy}
          onClick={connect}
          className={`${buttonClass} hover:border-primary/40 hover:bg-primary/5`}
        >
          {isBusy ? <LoaderCircleIcon className='animate-spin' /> : <WalletIcon strokeWidth={1.4} />}
          <span>{status === 'connecting' ? t('connect.connecting') : t('connect.button')}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={isUnsupported ? t('menu.unsupported') : address} className={buttonClass}>
            <span className='relative'>
              <WalletIcon strokeWidth={1.4} />
              {isUnsupported && (
                <span aria-hidden className='absolute -top-0.5 -right-0.5 size-2 rounded-full bg-destructive ring-2 ring-sidebar' />
              )}
            </span>
            <span className='font-mono'>{shortAddress(address)}</span>
            <ChevronsUpDownIcon className='ml-auto' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='top' align='start' className='w-56'>
          <DropdownMenuLabel className='font-normal'>
            <p className='text-small text-muted-foreground'>{t('menu.label')}</p>
          </DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              copy(address);
            }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? t('menu.copied') : t('menu.copy')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className='font-normal'>
            <p className='text-small text-muted-foreground'>{t('menu.network')}</p>
            {isUnsupported && (
              <p role='alert' className='mt-1 text-small text-destructive'>
                {t('menu.unsupported')}
              </p>
            )}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup value={isUnsupported ? '' : network.key} onValueChange={(key) => switchNetwork(key as NetworkKey)}>
            {Object.values(NETWORKS)
              .filter((n) => n.enabled)
              .map((n) => (
                <DropdownMenuRadioItem key={n.key} value={n.key}>
                  <span className='font-medium'>{n.name}</span>
                  <span className='font-mono text-small font-semibold'>{n.token.symbol}</span>
                  {n.testnet && <span className='ml-auto text-caption font-medium opacity-70'>{t('menu.testnet')}</span>}
                  {switchingTo === n.chainId && <LoaderCircleIcon className='animate-spin' />}
                </DropdownMenuRadioItem>
              ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
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
