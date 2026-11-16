import CopyButton from '@/components/ui/copy-button';
import type { NetworkConfig } from '@/constant';
import { useTranslation } from '@/integrations/i18n';

interface AddFundsCryptoUiProps {
  address?: string;
  qr?: string;
  label?: string;
  network: NetworkConfig;
}

const AddFundsCryptoUi = ({ address, qr, label, network }: AddFundsCryptoUiProps) => {
  const { t } = useTranslation('signetpass-page');
  return (
    <div className='flex flex-col items-center gap-3'>
      {qr && <img src={qr} alt={label ?? t('add-funds.crypto.address')} className='size-48 rounded-md border bg-white p-1' />}
      <div className='w-full'>
        <p className='text-small text-muted-foreground'>{label ?? t('add-funds.crypto.address')}</p>
        <div className='mt-1.5 flex items-center gap-2'>
          <code className='min-w-0 flex-1 font-mono text-small break-all'>{address}</code>
          {address && <CopyButton value={address} />}
        </div>
      </div>
      <p className='text-caption text-muted-foreground'>
        {t('add-funds.crypto.note', { token: network.token.symbol, network: network.name })}
      </p>
    </div>
  );
};

export default AddFundsCryptoUi;
