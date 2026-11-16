import { Button } from '@/components/ui/button';
import type { NetworkConfig } from '@/constant';
import { useTranslation } from '@/integrations/i18n';

interface ActivateSignetpassUiProps {
  name: string;
  network: NetworkConfig;
  isLoading: boolean;
  onActivate: () => void;
}

const ActivateSignetpassUi = ({ name, network, isLoading, onActivate }: ActivateSignetpassUiProps) => {
  const { t } = useTranslation('signetpass-page');
  return (
    <div className='flex flex-col gap-4'>
      <dl className='divide-y rounded-md border text-body'>
        <div className='flex items-center justify-between px-4 py-3'>
          <dt className='text-muted-foreground'>{t('activate.signetpass')}</dt>
          <dd className='truncate'>{name}</dd>
        </div>
        <div className='flex items-center justify-between px-4 py-3'>
          <dt className='text-muted-foreground'>{t('activate.network')}</dt>
          <dd>
            {network.name} <span className='font-mono text-muted-foreground'>{network.token.symbol}</span>
          </dd>
        </div>
      </dl>
      <p className='text-small text-muted-foreground'>{t('activate.note', { network: network.name })}</p>
      <Button onClick={onActivate} disabled={isLoading}>
        {isLoading ? t('activate.activating') : t('activate.submit')}
      </Button>
    </div>
  );
};

export default ActivateSignetpassUi;
