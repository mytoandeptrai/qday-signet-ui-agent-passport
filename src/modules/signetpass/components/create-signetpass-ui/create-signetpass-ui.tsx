import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/components/form-fields/form-input';
import { FormRadioGroup } from '@/components/form-fields/form-radio-group';
import ShortAddress from '@/components/ui/short-address';
import SignStatusUi from '@/components/ui/sign-status';
import { Button } from '@/components/ui/button';
import { NETWORKS } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import type { SignStatus } from '@/integrations/wallet';
import type { CreateSignetPassFormData } from '../../hooks';

interface CreateSignetPassUiProps {
  owner?: string;
  status: SignStatus;
  summary?: string;
  isLoading: boolean;
}

const NETWORK_OPTIONS = (['base', 'qday'] as const).map((key) => ({
  value: key,
  label: `${NETWORKS[key].name} · ${NETWORKS[key].token.symbol}`,
}));

const CreateSignetPassUi = ({ owner, status, summary, isLoading }: CreateSignetPassUiProps) => {
  const { t } = useTranslation('signetpass-page');
  const { control } = useFormContext<CreateSignetPassFormData>();
  return (
    <div className='flex flex-col gap-4'>
      <FormInput control={control} name='name' label={t('create.name')} placeholder={t('create.name-placeholder')} disabled={isLoading} required />
      <FormRadioGroup control={control} name='network' label={t('create.network')} options={NETWORK_OPTIONS} orientation='horizontal' disabled={isLoading} />
      <dl className='rounded-md border'>
        <div className='flex items-center justify-between px-4 py-3 text-body'>
          <dt className='text-muted-foreground'>{t('create.owner')}</dt>
          <dd className='font-mono'>{owner && <ShortAddress value={owner} />}</dd>
        </div>
      </dl>
      <p className='text-small text-muted-foreground'>{t('create.gas')}</p>
      <SignStatusUi status={status} summary={summary} />
      <Button type='submit' disabled={isLoading}>
        {isLoading ? t('create.creating') : t('create.submit')}
      </Button>
    </div>
  );
};

export default CreateSignetPassUi;
