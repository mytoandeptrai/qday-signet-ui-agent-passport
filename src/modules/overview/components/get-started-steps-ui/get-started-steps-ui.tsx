import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';
import { GET_STARTED_STEPS, type GetStartedStepId } from '../../utils';

type GetStartedStepsUiProps = {
  stepId: GetStartedStepId;
  done: Record<GetStartedStepId, boolean>;
  onSelectStep: (index: number) => void;
};

const GetStartedStepsUi = ({ stepId, done, onSelectStep }: GetStartedStepsUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <ol className='space-y-1'>
      {GET_STARTED_STEPS.map((id, i) => (
        <li key={id}>
          <button
            type='button'
            onClick={() => onSelectStep(i)}
            className={cn('flex w-full items-center gap-4 py-2 text-left text-body', id === stepId ? 'text-foreground' : 'text-muted-foreground')}
          >
            {done[id] ? (
              <span className='grid size-5 place-items-center rounded-full bg-success text-white'>
                <Check className='size-3' strokeWidth={3} />
              </span>
            ) : (
              <Circle className='size-5' strokeWidth={1.3} />
            )}
            {t(`get-started.steps.${id}`)}
          </button>
        </li>
      ))}
    </ol>
  );
};

export default GetStartedStepsUi;
