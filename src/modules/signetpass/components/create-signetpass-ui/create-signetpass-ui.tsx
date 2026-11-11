import SignStatusUi from '@/components/app/sign-status';
import { Button } from '@/components/ui/button';
import type { NetworkConfig } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import type { SignStatus } from '@/integrations/wallet';
import { shortAddress } from '@/lib/format';

interface CreateSignetPassUiProps {
  owner?: string;
  signetPassAddress?: string;
  network: NetworkConfig;
  status: SignStatus;
  isLoading: boolean;
  onCreate: () => void;
}

const CreateSignetPassUi = ({ owner, signetPassAddress, network, status, isLoading, onCreate }: CreateSignetPassUiProps) => {
  const { t } = useTranslation('signetpass-page');
  const rows = [
    [t('create.owner'), owner ? shortAddress(owner) : ''],
    [t('create.network'), `${network.name} · ${network.token.symbol}`],
    [t('create.address'), signetPassAddress ? shortAddress(signetPassAddress) : ''],
  ];
  return (
    <div className='flex flex-col gap-4'>
      <dl className='divide-y rounded-md border'>
        {rows.map(([label, value]) => (
          <div key={label} className='flex items-center justify-between px-4 py-3 text-body'>
            <dt className='text-muted-foreground'>{label}</dt>
            <dd className='font-mono'>{value}</dd>
          </div>
        ))}
      </dl>
      <p className='text-small text-muted-foreground'>{t('create.gas')}</p>
      <SignStatusUi status={status} />
      <Button onClick={onCreate} disabled={isLoading}>
        {isLoading ? t('create.creating') : t('create.submit')}
      </Button>
    </div>
  );
};

export default CreateSignetPassUi;
