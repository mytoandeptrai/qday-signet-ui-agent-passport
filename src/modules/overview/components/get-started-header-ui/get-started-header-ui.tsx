import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { ChevronUp } from 'lucide-react';
import type { GetStartedStepId } from '../../utils';

type GetStartedHeaderUiProps = {
  stepId: GetStartedStepId;
  open: boolean;
  onToggleOpen: () => void;
};

const GetStartedHeaderUi = ({ stepId, open, onToggleOpen }: GetStartedHeaderUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <div className='grid gap-8 md:grid-cols-[200px_minmax(0,1fr)]'>
      <h2 className='text-body text-muted-foreground'>{t('get-started.title')}</h2>
      <div className='flex items-start justify-between'>
        <span className='text-body text-muted-foreground'>{t(`get-started.hints.${stepId}`)}</span>
        <button type='button' aria-label={open ? t('labels.collapse') : t('labels.expand')} onClick={onToggleOpen}>
          <ChevronUp className={cn('size-5 text-muted-foreground transition-transform', !open && 'rotate-180')} />
        </button>
      </div>
    </div>
  );
};

export default GetStartedHeaderUi;
