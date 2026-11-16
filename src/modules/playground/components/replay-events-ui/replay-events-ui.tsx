import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import type { PlaygroundEventTone, PlaygroundStep } from '@/types/passport';

type ReplayEventsUiProps = {
  events: { step: PlaygroundStep; active: boolean }[];
  summary: string;
};

const DOT: Record<PlaygroundEventTone, string> = {
  info: 'bg-border',
  approval: 'bg-foreground',
  payment: 'bg-brand',
};

const ReplayEventsUi = ({ events, summary }: ReplayEventsUiProps) => {
  const { t } = useTranslation('playground-page');
  return (
    <div>
      <p className='text-body text-muted-foreground'>{t('notes.title')}</p>
      <p className='mt-1 text-small text-muted-foreground'>{t('notes.description')}</p>
      {events.length === 0 ? (
        <p className='mt-4 text-body text-muted-foreground'>{summary}</p>
      ) : (
        <ol className='mt-4 ml-1.5 space-y-4 border-l pl-5'>
          {events.map(({ step, active }, i) => (
            <li key={`${i}-${step.text}`} className={cn('relative text-body leading-normal', active ? 'text-foreground' : 'text-muted-foreground')}>
              <span aria-hidden className={cn('absolute top-[0.45em] -left-[25.5px] size-2 rounded-full', DOT[step.tone ?? 'info'])} />
              <span className='flex items-baseline justify-between gap-3'>
                <span>{step.text}</span>
                {step.tone === 'payment' && <span className='shrink-0 tabular-nums'>{(step.amount ?? 0).toFixed(2)} USDC</span>}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default ReplayEventsUi;
