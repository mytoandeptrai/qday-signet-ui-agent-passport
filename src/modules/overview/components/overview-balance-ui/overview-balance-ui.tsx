import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/integrations/i18n';
import { money, shortAddress } from '@/lib/format';
import { Link } from '@tanstack/react-router';
import { Copy, Wallet } from 'lucide-react';

type OverviewBalanceUiProps = {
  available: number;
  walletAddress?: string;
  onCopyAddress: () => void;
};

const OverviewBalanceUi = ({ available, walletAddress, onCopyAddress }: OverviewBalanceUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <>
      <div className='text-body text-muted-foreground'>{t('balance.title')}</div>
      <div className='mt-1.5 font-display text-figure leading-none font-semibold tabular-nums'>{money(available)}</div>
      <div className='mt-5 flex gap-2'>
        <Button asChild variant='outline' className='flex-1'>
          <Link to='/deposit'>{t('labels.add-funds')}</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='px-4'>
              <Wallet className='size-4' strokeWidth={1.4} /> {t('balance.wallet')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-64'>
            <DropdownMenuLabel>{t('balance.your-wallet')}</DropdownMenuLabel>
            <DropdownMenuItem onSelect={onCopyAddress}>
              <span className='font-mono text-caption'>{walletAddress && shortAddress(walletAddress)}</span>
              <Copy className='ml-auto size-4' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default OverviewBalanceUi;
