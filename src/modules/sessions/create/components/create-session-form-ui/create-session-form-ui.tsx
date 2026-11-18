import SignStatusUi from '@/components/ui/sign-status';
import { FormInput } from '@/components/form-fields/form-input';
import { FormNumberInput } from '@/components/form-fields/form-number-input';
import { FormSelect } from '@/components/form-fields/form-select';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import type { SignStatus } from '@/integrations/wallet';
import { money } from '@/lib/format';
import { useFormContext, useWatch } from 'react-hook-form';
import type { CreateSessionFormData } from '../../hooks';

type CreateSessionFormUiProps = {
  available: number;
  agentNames: string[];
  status: SignStatus;
  summary?: string;
  isLoading?: boolean;
  onRegisterAgent: () => void;
};

const CreateSessionFormUi = ({ available, agentNames, status, summary, isLoading = false, onRegisterAgent }: CreateSessionFormUiProps) => {
  const { control } = useFormContext<CreateSessionFormData>();
  const agent = useWatch({ control, name: 'agent' });
  const { t } = useTranslation('create-session-page');
  return (
    <div className='space-y-5'>
      <FormInput control={control} name='task' label={t('fields.task.label')} placeholder={t('fields.task.placeholder')} />
      {agentNames.length > 0 ? (
        <FormSelect
          control={control}
          name='agent'
          label={t('fields.agent.label')}
          options={agentNames.map((a) => ({ value: a, label: a }))}
          fullWidth
        />
      ) : (
        <div className='flex flex-col items-start gap-2'>
          <p className='text-body font-medium'>{t('fields.agent.label')}</p>
          <p className='text-body text-muted-foreground'>{t('fields.agent.empty')}</p>
          <Button type='button' variant='outline' size='sm' onClick={onRegisterAgent}>
            {t('fields.agent.register')}
          </Button>
        </div>
      )}
      <div className='grid items-start gap-6 sm:grid-cols-2'>
        <FormNumberInput control={control} name='limit' label={t('fields.limit.label')} />
        <FormNumberInput control={control} name='perCallLimit' label={t('fields.per-call.label')} />
      </div>
      <FormNumberInput control={control} name='durationHours' decimalScale={0} label={t('fields.hours.label')} />
      <p className='text-body text-muted-foreground'>
        {t('available')} <b className='font-medium text-foreground'>{money(available)}</b>
      </p>
      <SignStatusUi status={status} summary={summary} />
      <Button type='submit' disabled={isLoading || !agent}>
        {isLoading ? t('labels.creating') : t('labels.create')}
      </Button>
    </div>
  );
};

export default CreateSessionFormUi;
