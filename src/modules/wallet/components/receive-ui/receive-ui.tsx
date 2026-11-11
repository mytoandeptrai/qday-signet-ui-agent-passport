import CopyButton from '@/components/ui/copy-button';
import { useTranslation } from '@/integrations/i18n';

interface ReceiveUiProps {
  address?: string;
  qr?: string;
}

const ReceiveUi = ({ address, qr }: ReceiveUiProps) => {
  const { t } = useTranslation('wallet-page');
  return (
    <div className='flex flex-col items-center gap-4'>
      {qr && <img src={qr} alt={t('receive.address')} className='size-48 rounded-md border bg-white p-1' />}
      <div className='w-full'>
        <p className='text-small text-muted-foreground'>{t('receive.address')}</p>
        <div className='mt-1.5 flex items-center gap-2'>
          <code className='min-w-0 flex-1 font-mono text-small break-all'>{address}</code>
          {address && <CopyButton value={address} toastMessage={t('receive.copied')} />}
        </div>
      </div>
      <p className='text-caption text-muted-foreground'>{t('receive.note')}</p>
    </div>
  );
};

export default ReceiveUi;
