import { FormInput } from '@/components/form-fields/form-input';
import { FormSelect } from '@/components/form-fields/form-select';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';
import { useFormContext } from 'react-hook-form';
import { AGENTS, type CreateSessionFormData } from '../../hooks';

type CreateSessionFormUiProps = {
  available: number;
  isLoading?: boolean;
};

const agentOptions = AGENTS.map((a) => ({ value: a, label: a }));

const CreateSessionFormUi = ({ available, isLoading = false }: CreateSessionFormUiProps) => {
  const { control } = useFormContext<CreateSessionFormData>();
  const { t } = useTranslation('create-session-page');
  return (
    <div className='space-y-6'>
      <FormInput control={control} name='task' label={t('fields.task.label')} placeholder={t('fields.task.placeholder')} />
      <FormSelect control={control} name='agent' label={t('fields.agent.label')} options={agentOptions} />
      <div className='grid gap-6 sm:grid-cols-2'>
        <FormInput control={control} name='limit' type='number' step='any' label={t('fields.limit.label')} />
        <FormInput control={control} name='perCallLimit' type='number' step='any' label={t('fields.per-call.label')} />
      </div>
      <FormInput control={control} name='durationHours' type='number' label={t('fields.hours.label')} />
      <p className='text-body text-muted-foreground'>
        {t('available')} <b className='font-medium text-foreground'>{money(available)}</b>
      </p>
      <Button type='submit' disabled={isLoading}>
        {isLoading ? t('labels.creating') : t('labels.create')}
      </Button>
    </div>
  );
};

export default CreateSessionFormUi;
