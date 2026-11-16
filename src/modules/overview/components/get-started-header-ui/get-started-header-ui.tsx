import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { ChevronUp } from 'lucide-react';

type GetStartedHeaderUiProps = {
  open: boolean;
  onToggleOpen: () => void;
};

const GetStartedHeaderUi = ({ open, onToggleOpen }: GetStartedHeaderUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <div className='flex items-center justify-between'>
      <h2 className='text-body text-muted-foreground'>{t('get-started.title')}</h2>
      <Button type='button' variant='ghost' size='icon-sm' aria-expanded={open} aria-label={open ? t('labels.collapse') : t('labels.expand')} onClick={onToggleOpen}>
        <ChevronUp className={cn('size-5 text-muted-foreground transition-transform', !open && 'rotate-180')} />
      </Button>
    </div>
  );
};

export default GetStartedHeaderUi;
