import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import type { PlaygroundStep } from '@/types/passport';

type ReplayNotesUiProps = {
  notes: PlaygroundStep[];
  summary: string;
};

const ReplayNotesUi = ({ notes, summary }: ReplayNotesUiProps) => {
  const { t } = useTranslation('playground-page');
  return (
    <div>
      <p className='text-body text-muted-foreground'>{t('notes.title')}</p>
      {notes.length === 0 ? (
        <p className='mt-2 text-body text-muted-foreground'>{summary}</p>
      ) : (
        <ol className='mt-2 space-y-3'>
          {notes.map((s, i) => (
            <li key={s.text} className={cn('text-body leading-normal', i === notes.length - 1 ? 'text-foreground' : 'text-muted-foreground')}>
              {s.note}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default ReplayNotesUi;
