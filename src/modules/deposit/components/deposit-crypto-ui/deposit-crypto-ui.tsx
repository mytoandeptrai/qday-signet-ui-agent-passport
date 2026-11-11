import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { Copy } from 'lucide-react';

type DepositCryptoUiProps = {
  address?: string;
  onCopyAddress: () => void;
};

const DepositCryptoUi = ({ address, onCopyAddress }: DepositCryptoUiProps) => {
  const { t } = useTranslation('deposit-page');
  return (
    <div className='mt-6 rounded-md border p-5'>
      <div className='text-small text-muted-foreground'>{t('crypto.address')}</div>
      <div className='mt-2 flex items-center gap-3'>
        <code className='min-w-0 flex-1 font-mono text-small break-all'>{address}</code>
        <Button type='button' size='sm' variant='outline' onClick={onCopyAddress}>
          <Copy /> {t('crypto.copy')}
        </Button>
      </div>
      <p className='mt-3 text-caption text-text-3'>{t('crypto.note')}</p>
    </div>
  );
};

export default DepositCryptoUi;
