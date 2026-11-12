import { CreditCardIcon, LoaderCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShortAddress from '@/components/ui/short-address';
import type { NetworkConfig } from '@/constant';
import { useTranslation } from '@/integrations/i18n';

interface AddFundsCardUiProps {
  address?: string;
  network: NetworkConfig;
  onNetwork: boolean;
  isOpening: boolean;
  isSwitching: boolean;
  onSwitchNetwork: () => void;
  onContinue: () => void;
}

const AddFundsCardUi = ({ address, network, onNetwork, isOpening, isSwitching, onSwitchNetwork, onContinue }: AddFundsCardUiProps) => {
  const { t } = useTranslation('signetpass-page');
  const rows = [
    { label: t('add-funds.card.pay-with'), value: t('add-funds.card.card') },
    { label: t('add-funds.card.receive'), value: t('add-funds.card.token-on', { token: network.token.symbol, network: network.name }) },
  ];

  return (
    <div className='flex flex-col gap-4'>
      <dl className='divide-y rounded-sm border'>
        {rows.map((row) => (
          <div key={row.label} className='flex items-center justify-between gap-4 px-4 py-3 text-small'>
            <dt className='text-muted-foreground'>{row.label}</dt>
            <dd className='font-medium'>{row.value}</dd>
          </div>
        ))}
        <div className='flex items-center justify-between gap-4 px-4 py-3 text-small'>
          <dt className='text-muted-foreground'>{t('add-funds.card.to')}</dt>
          <dd className='font-mono font-medium'>{address && <ShortAddress value={address} />}</dd>
        </div>
      </dl>

      {onNetwork ? (
        <>
          <Button onClick={onContinue} disabled={isOpening || !address} aria-busy={isOpening}>
            {isOpening ? <LoaderCircleIcon className='animate-spin' /> : <CreditCardIcon strokeWidth={1.4} />}
            {isOpening ? t('add-funds.card.opening') : t('add-funds.card.continue')}
          </Button>
          <p className='text-caption text-muted-foreground'>{t('add-funds.card.note')}</p>
        </>
      ) : (
        <>
          <p className='text-small text-muted-foreground'>{t('add-funds.card.switch-hint', { network: network.name })}</p>
          <Button variant='outline' onClick={onSwitchNetwork} disabled={isSwitching} aria-busy={isSwitching}>
            {isSwitching && <LoaderCircleIcon className='animate-spin' />}
            {t('add-funds.card.switch', { network: network.name })}
          </Button>
        </>
      )}
    </div>
  );
};

export default AddFundsCardUi;
