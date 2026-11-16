import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/components/form-fields/form-input';
import ShortAddress from '@/components/ui/short-address';
import SignStatusUi from '@/components/ui/sign-status';
import { Button } from '@/components/ui/button';
import type { NetworkConfig } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';
import type { SignStatus } from '@/integrations/wallet';
import type { CreateSignetPassFormData } from '../../hooks';

interface CreateSignetPassUiProps {
  owner?: string;
  network: NetworkConfig;
  balance: number;
  fee: number;
  insufficient: boolean;
  status: SignStatus;
  summary?: string;
  isLoading: boolean;
}

const CreateSignetPassUi = ({ owner, network, balance, fee, insufficient, status, summary, isLoading }: CreateSignetPassUiProps) => {
  const { t } = useTranslation('signetpass-page');
  const { control } = useFormContext<CreateSignetPassFormData>();
  return (
    <div className='flex flex-col gap-4'>
      <FormInput control={control} name='name' label={t('create.name')} placeholder={t('create.name-placeholder')} disabled={isLoading} required />
      <dl className='divide-y rounded-md border text-body'>
        <div className='flex items-center justify-between px-4 py-3'>
          <dt className='text-muted-foreground'>{t('create.owner')}</dt>
          <dd className='font-mono'>{owner && <ShortAddress value={owner} />}</dd>
        </div>
        <div className='flex items-center justify-between px-4 py-3'>
          <dt className='text-muted-foreground'>{t('create.network')}</dt>
          <dd>
            {network.name} <span className='font-mono text-muted-foreground'>{network.token.symbol}</span>
          </dd>
        </div>
        <div className='flex items-center justify-between px-4 py-3'>
          <dt className='text-muted-foreground'>{t('create.fee')}</dt>
          <dd className='tabular-nums'>
            {money(fee)} {network.token.symbol}
          </dd>
        </div>
        <div className='flex items-center justify-between px-4 py-3'>
          <dt className='text-muted-foreground'>{t('create.balance')}</dt>
          <dd className='tabular-nums'>
            {money(balance)} {network.token.symbol}
          </dd>
        </div>
      </dl>
      <p className={insufficient ? 'text-small text-destructive' : 'text-small text-muted-foreground'} role={insufficient ? 'alert' : undefined}>
        {insufficient ? t('create.errors.balance', { fee: money(fee), token: network.token.symbol }) : t('create.note')}
      </p>
      <SignStatusUi status={status} summary={summary} />
      <Button type='submit' disabled={isLoading || insufficient}>
        {isLoading ? t('create.creating') : t('create.submit')}
      </Button>
    </div>
  );
};

export default CreateSignetPassUi;
