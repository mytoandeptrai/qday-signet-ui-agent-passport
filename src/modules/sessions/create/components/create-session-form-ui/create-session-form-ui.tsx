import SignStatusUi from '@/components/ui/sign-status';
import { FormInput } from '@/components/form-fields/form-input';
import { FormNumberInput } from '@/components/form-fields/form-number-input';
import { FormSelect } from '@/components/form-fields/form-select';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import type { SignStatus } from '@/integrations/wallet';
import { money } from '@/lib/format';
import { useFormContext } from 'react-hook-form';
import { AGENTS, type CreateSessionFormData } from '../../hooks';

type CreateSessionFormUiProps = {
  available: number;
  status: SignStatus;
  summary?: string;
  isLoading?: boolean;
};

const agentOptions = AGENTS.map((a) => ({ value: a, label: a }));

const CreateSessionFormUi = ({ available, status, summary, isLoading = false }: CreateSessionFormUiProps) => {
  const { control } = useFormContext<CreateSessionFormData>();
  const { t } = useTranslation('create-session-page');
  return (
    <div className='space-y-5'>
      <FormInput control={control} name='task' label={t('fields.task.label')} placeholder={t('fields.task.placeholder')} />
      <FormSelect control={control} name='agent' label={t('fields.agent.label')} options={agentOptions} />
      <div className='grid items-start gap-6 sm:grid-cols-2'>
        <FormNumberInput control={control} name='limit' label={t('fields.limit.label')} />
        <FormNumberInput control={control} name='perCallLimit' label={t('fields.per-call.label')} />
      </div>
      <FormNumberInput control={control} name='durationHours' decimalScale={0} label={t('fields.hours.label')} />
      <p className='text-body text-muted-foreground'>
        {t('available')} <b className='font-medium text-foreground'>{money(available)}</b>
      </p>
      <SignStatusUi status={status} summary={summary} />
      <Button type='submit' disabled={isLoading}>
        {isLoading ? t('labels.creating') : t('labels.create')}
      </Button>
    </div>
  );
};

export default CreateSessionFormUi;
