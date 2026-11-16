import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GET_STARTED_STEPS, type GetStartedStepId } from '../../utils';

type GetStartedStepsUiProps = {
  stepId: GetStartedStepId;
  done: Record<GetStartedStepId, boolean>;
  onSelectStep: (index: number) => void;
};

const LAST = GET_STARTED_STEPS.length - 1;

/** The path from a funded wallet to a working agent: stations along a line on wide screens, a plain list on narrow ones. */
const GetStartedStepsUi = ({ stepId, done, onSelectStep }: GetStartedStepsUiProps) => {
  const { t } = useTranslation('overview-page');
  // The line runs up to the first step still to do. It starts empty and fills once, when the page opens.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const next = GET_STARTED_STEPS.findIndex((id) => !done[id]);
  const reached = next === -1 ? LAST : next;

  return (
    <ol className='relative mt-4 flex flex-col gap-1 md:grid md:grid-cols-7 md:gap-0'>
      <span aria-hidden='true' className='absolute top-3 right-[calc(100%/14)] left-[calc(100%/14)] hidden h-px bg-border md:block'>
        <span
          className='block h-full bg-brand transition-[width] duration-700 ease-out motion-reduce:transition-none'
          style={{ width: mounted ? `${(reached / LAST) * 100}%` : '0%' }}
        />
      </span>
      {GET_STARTED_STEPS.map((id, i) => {
        const current = id === stepId;
        return (
          <li key={id} className='relative'>
            <Button
              type='button'
              variant='ghost'
              aria-current={current ? 'step' : undefined}
              onClick={() => onSelectStep(i)}
              className='group h-auto w-full justify-start gap-4 rounded-md px-0 py-1.5 text-left whitespace-normal md:flex-col md:items-center md:gap-2 md:px-2 md:text-center hover:bg-transparent dark:hover:bg-transparent'
            >
              <span
                className={cn(
                  'relative grid size-6 shrink-0 place-items-center rounded-full border bg-background text-small tabular-nums',
                  done[id] && 'border-success bg-success text-white',
                  current && !done[id] && 'border-brand text-foreground ring-2 ring-brand/25',
                  !current && !done[id] && 'text-muted-foreground group-hover:border-foreground/50 group-hover:text-foreground'
                )}
              >
                {done[id] ? <Check className='size-3.5' strokeWidth={3} /> : i + 1}
              </span>
              <span className={cn('text-body font-normal text-balance', current ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground')}>{t(`get-started.steps.${id}`)}</span>
            </Button>
          </li>
        );
      })}
    </ol>
  );
};

export default GetStartedStepsUi;
