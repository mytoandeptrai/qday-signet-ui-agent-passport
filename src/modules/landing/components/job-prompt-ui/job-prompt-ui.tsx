import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { formatUsd } from '../../utils';

type JobPromptUiProps = {
  isAsked: boolean;
  onAsk: () => void;
};

const JobPromptUi = ({ isAsked, onAsk }: JobPromptUiProps) => {
  const { t } = useTranslation('landing-page');

  return (
    <button type='button' onClick={onAsk} className='cursor-pointer text-left'>
      <div className='mb-2 text-sm leading-[1.4]'>{t('how.job-prompt')}</div>
      <div
        className={cn(
          'flex justify-between gap-3 text-[13px] text-muted-foreground tabular-nums transition-opacity',
          isAsked ? 'opacity-100' : 'opacity-70'
        )}
      >
        <span>{t('how.job-line')}</span>
        <b className='font-normal text-foreground'>{formatUsd(3.24)}</b>
      </div>
    </button>
  );
};

export default JobPromptUi;
