import CopyButton from '@/components/ui/copy-button';
import type { NetworkConfig } from '@/constant';
import { useTranslation } from '@/integrations/i18n';

interface AddFundsCryptoUiProps {
  address?: string;
  network: NetworkConfig;
}

const AddFundsCryptoUi = ({ address, network }: AddFundsCryptoUiProps) => {
  const { t } = useTranslation('signetpass-page');
  return (
    <div className='flex flex-col gap-3'>
      <p className='text-small text-muted-foreground'>{t('add-funds.crypto.address')}</p>
      <div className='flex items-center gap-2'>
        <code className='min-w-0 flex-1 font-mono text-small break-all'>{address}</code>
        {address && <CopyButton value={address} />}
      </div>
      <p className='text-caption text-muted-foreground'>
        {t('add-funds.crypto.note', { token: network.token.symbol, network: network.name })}
      </p>
    </div>
  );
};

export default AddFundsCryptoUi;
