import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { TERMINAL_TONES } from '../../utils';

type TerminalCardUiProps = {
  /** 0..1: how much of the terminal has typed in. */
  reveal: number;
};

const TerminalCardUi = ({ reveal }: TerminalCardUiProps) => {
  const { t } = useTranslation('landing-page');
  const lines = t('terminal.lines', { returnObjects: true }) as string[];
  const shown = Math.ceil(reveal * lines.length);

  return (
    <div className='h-full overflow-hidden rounded-md border bg-white shadow-[0_1px_2px_rgba(27,30,36,.04),0_24px_64px_rgba(27,30,36,.12)]'>
      <div className='flex items-center gap-1.5 border-b px-4 py-3'>
        <span className='size-2.5 rounded-full bg-border' />
        <span className='size-2.5 rounded-full bg-border' />
        <span className='size-2.5 rounded-full bg-border' />
        <span className='ml-3 font-mono text-xs text-text-3'>{t('terminal.name')}</span>
      </div>
      <div className='space-y-2 p-5 font-mono text-[12.5px] leading-[1.55]'>
        {lines.slice(0, shown).map((line, i) => (
          <p
            key={line}
            className={cn(
              TERMINAL_TONES[i] === 'stop' ? 'text-danger' : TERMINAL_TONES[i] === 'ok' ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default TerminalCardUi;
